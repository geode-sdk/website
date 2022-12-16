
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["src/index.html"],
    theme: {
        colors: {
            'purple':       '#714a9a',
            'purple-light': '#b57ae2',
            'yellow':       '#f5dd9f',
            'green':        '#9ff4b7',
            'pink':         '#f49fe9',
            'blue':         '#6a80d8',
            'navy':         '#3b3ddb',
            'red':          '#e23485',
            'gray':         '#272727',
            'gray-dark':    '#222',
            'gray-darker':  '#111',
            'gray-light':   '#555',
            'white':        '#eee',
            'light':        '#aaa',
            'opaque':       'rgba(255, 255, 255, 100)',
            'cyan':         '#6ac2d8',
        },
        fontFamily: {
            'head': ['"Varela Round"', 'sans-serif'],
            'text': ['"Open Sans"', 'sans-serif'],
        },
        extend: {
            spacing: {
                '1px': '1px',
            }
        }
    },
    safelist: [{
        pattern: /hljs+/,
    }],
    plugins: [],
};
