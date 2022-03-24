import { useBlockProps } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/block-edit-save/#save
 *
 * @param {Object} props            Properties passed to the function.
 * @param {Object} props.attributes Available block attributes.
 * @return {WPElement} Element to render.
 */
export default function save({ attributes }) {
    const blockProps = useBlockProps.save();

    const getWikiData = url => {
        // const _url = url.trim();
        fetch(url).then(response => console.log(response));
    };

    useEffect(() => {
        getWikiData();
    }, [attributes.url]);

    return (
        <div {...blockProps} id="wikinfo" url={attributes.url}>
            Wiki link: {attributes.url}
        </div>
    );
}
