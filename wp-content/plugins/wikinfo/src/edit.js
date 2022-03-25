import { TextControl } from "@wordpress/components";
import { useBlockProps } from "@wordpress/block-editor";
import { useEffect, useState } from "@wordpress/element";

import wiki from "wikipedia";

/**
 * attributes = {
 *   title: "",
 *   summary: "",
 * }
 */

export default function Edit({ attributes, setAttributes }) {
    const blockProps = useBlockProps();

    const [subject, setSubject] = useState("");
    const [autocompletedSubject, setAutocompletedSubject] = useState("");
    const [searchResults, setSearchResults] = useState({
        open: false,
        openable: true,
        results: [],
        suggestion: "",
    });

    const getDataFromWikipedia = async subject => {
        if (!subject) return;

        try {
            const wikiData = await wiki.summary(subject);
            console.log("wiki data", wikiData);

            return {
                title: wikiData.title,
                summary: wikiData.extract,
            };
        } catch (error) {
            console.log(error);
        }
    };

    const getWikiSearchResults = async subject => {
        if (!subject) {
            setSearchResults([]);
            return;
        }

        const _searchResults = await wiki.search(subject, {
            suggestion: true,
            limit: 10,
        });

        return _searchResults;
    };

    useEffect(() => {
        setSubject(attributes.title);
    }, []);

    useEffect(() => {
        if (searchResults.openable) {
            getWikiSearchResults(subject) //
                .then(response => {
                    if (!response) return;

                    setSearchResults({
                        ...searchResults,
                        open: true,
                        results: response.results,
                        suggestion: response.suggestion,
                    });
                });
        }
    }, [subject]);

    // Search only on result click
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            getDataFromWikipedia(subject) //
                .then(wikiData => {
                    setAttributes(wikiData);
                });
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [autocompletedSubject]);

    return (
        <div className="wikinfo-container">
            <TextControl
                {...blockProps}
                value={subject}
                onChange={val => {
                    setSubject(val);
                    setSearchResults({ ...searchResults, openable: true });
                }}
            />

            {!searchResults.open && <span>{attributes.summary}</span>}

            {searchResults.open && searchResults.results && (
                <ul>
                    {/* search suggestion */}
                    {searchResults.suggestion && (
                        <li>
                            <button
                                className="search-result"
                                onClick={() => {
                                    setSubject(searchResults.suggestion);
                                    setAutocompletedSubject(searchResults.suggestion);
                                }}
                            >
                                {searchResults.suggestion}
                            </button>
                        </li>
                    )}

                    {/* search results */}
                    {searchResults.results.map((result, index) => (
                        <li>
                            <button
                                className="search-result"
                                key={index}
                                onClick={() => {
                                    setSubject(result.title);
                                    setAutocompletedSubject(result.title);
                                    setSearchResults({ ...searchResults, open: false, openable: false });
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
