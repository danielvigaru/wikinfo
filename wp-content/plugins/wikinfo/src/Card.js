export default function Card({ blockProps, image, link, summary, title }) {
    return (
        <a {...blockProps} href={link} target="_blank" rel="noopener" className="wikinfo">
            <span id="title">{title}</span>
            {image && <img src={image} aria-labelledby="title" id="thumbnail" />}
            <div id="summary">{summary}</div>
        </a>
    );
}
