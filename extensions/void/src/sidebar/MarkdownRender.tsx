import React, { JSX, useState } from 'react';
import { MarkedToken, Token, TokensList } from 'marked';
import { awaitVSCodeResponse, getVSCodeAPI } from './getVscodeApi';


const Code = ({ text }: { text: string }) => {
    const [submitting, setSubmitting] = useState(false)

    return <div>
        <div className='text-sm'>
            <button className='text-sm' onClick={async () => {
                getVSCodeAPI().postMessage({ type: 'applyCode', code: text })
            }}
            >
                Apply
            </button>
        </div>
        <pre className='bg-black text-gray-50 rounded-sm overflow-hidden'>
            {text}
        </pre>
    </div>
}

const Render = ({ token }: { token: Token }) => {

    // deal with built-in tokens first (assume marked token)
    const t = token as MarkedToken

    if (t.type === "space") {
        return <span>{t.raw}</span>;
    }

    if (t.type === "code") {
        return <Code text={t.text} />
    }

    if (t.type === "heading") {
        const HeadingTag = `h${t.depth}` as keyof JSX.IntrinsicElements;
        return <HeadingTag>{t.text}</HeadingTag>;
    }

    if (t.type === "table") {
        return (
            <table>
                <thead>
                    <tr>
                        {t.header.map((cell: any, index: number) => (
                            <th key={index} style={{ textAlign: t.align[index] || 'left' }}>
                                {cell.raw}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {t.rows.map((row: any[], rowIndex: number) => (
                        <tr key={rowIndex}>
                            {row.map((cell: any, cellIndex: number) => (
                                <td key={cellIndex} style={{ textAlign: t.align[cellIndex] || 'left' }}>
                                    {cell.raw}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    if (t.type === "hr") {
        return <hr />;
    }

    if (t.type === "blockquote") {
        return <blockquote>{t.text}</blockquote>;
    }

    if (t.type === "list") {

        const ListTag = t.ordered ? 'ol' : 'ul';
        return (
            <ListTag start={t.start !== '' ? t.start : undefined}
                className={`list-inside ${t.ordered ? 'list-decimal' : 'list-disc'}`}
            >
                {t.items.map((item, index) => (
                    <li key={index}>
                        {item.task && (
                            <input type="checkbox" checked={item.checked} readOnly />
                        )}
                        {item.text}
                    </li>
                ))}
            </ListTag>
        );
    }

    if (t.type === "paragraph") {
        return <p>{t.text}</p>;
    }

    if (t.type === "html") {
        return <pre>{`<html>`}{t.raw}{`</html>`}</pre>;
    }

    if (t.type === "text" || t.type === "escape") {
        return <span>{t.raw}</span>;
    }

    if (t.type === "def") {
        return null; // Definitions are typically not rendered
    }

    if (t.type === "link") {
        return <a href={t.href} title={t.title ?? undefined}>{t.text}</a>;
    }

    if (t.type === "image") {
        return <img src={t.href} alt={t.text} title={t.title ?? undefined} />;
    }

    if (t.type === "strong") {
        return <strong>{t.text}</strong>;
    }

    if (t.type === "em") {
        return <em>{t.text}</em>;
    }

    if (t.type === "codespan") {
        return <code>{t.text}</code>;
    }

    if (t.type === "br") {
        return <br />;
    }

    if (t.type === "del") {
        return <del>{t.text}</del>;
    }


    // default
    return <div className='bg-orange-50 rounded-sm overflow-hidden'>
        <span className='text-xs text-orange-500'>Unknown type:</span>
        {t.raw}
    </div>;
};

const MarkdownRender = ({ tokens }: { tokens: TokensList }) => {
    return (
        <>
            {tokens.map((token, index) => (
                <Render key={index} token={token} />
            ))}
        </>
    );
};

export default MarkdownRender;