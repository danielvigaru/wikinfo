import { TextControl, Icon, Text } from "@wordpress/components";
import { useBlockProps } from "@wordpress/block-editor";
import { useEffect, useState } from "@wordpress/element";

import wiki from "wikipedia";

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    const [wikiData, setWikiData] = useState({
        title: "",
        summary: "",
    });
    const [subject, setSubject] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchResultsOptions, setSearchResultsOptions] = useState({
        open: false,
        openable: true,
    });

    const getWikiData = async subject => {
        if (!subject) return;

        try {
            const wikiData = await wiki.summary(subject);
            console.log("wikiData", wikiData);
            setWikiData({
                title: wikiData.title,
                summary: wikiData.extract,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getSearchResults = async subject => {
        if (!subject) {
            setSearchResults([]);
            return;
        }

        const searchResults = await wiki.search(subject, {
            suggestion: true,
            limit: 10,
        });
        setSearchResults(searchResults.results);
    };

    useEffect(() => {
        if (attributes.title) {
            setSubject(attributes.title);
        }
    }, [attributes.title]);

    useEffect(() => {
        if (searchResultsOptions.openable) {
            setSearchResultsOptions({ ...searchResultsOptions, open: true });
            getSearchResults(subject);
        }

        const timeoutId = setTimeout(() => {
            getWikiData(subject);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [subject]);

    return (
        <div className="wikinfo-container" title={wikiData.title} summary={wikiData.summary}>
            <TextControl
                {...blockProps}
                value={subject}
                onChange={val => {
                    setSubject(val);
                    setSearchResultsOptions({
                        ...searchResultsOptions,
                        openable: true,
                    });
                }}
            />
            {!searchResultsOptions.open && <span>{wikiData.summary}</span>}
            {searchResultsOptions.open && (
                <ul>
                    {searchResults.map((result, index) => (
                        <li>
                            <button
                                className="search-result"
                                key={index}
                                onClick={() => {
                                    setSubject(result.title);

                                    setAttributes({
                                        title: result.title,
                                        summary: result.extract,
                                    });

                                    setSearchResultsOptions({
                                        open: false,
                                        openable: false,
                                    });
                                }}
                            >
                                {result.title}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
