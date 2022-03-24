import { useBlockProps } from "@wordpress/block-editor";

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
    const title = attributes.title;
    const summary = attributes.summary;

    return (
        <div {...blockProps} title={title || " "} summary={summary || " "}>
            <div>Titlu: {title}</div>
            <div>Rezumat: {summary}</div>
        </div>
    );
}
