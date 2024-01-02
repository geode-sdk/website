/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "gen/**/*.html"
    ],
    theme: {
        colors: {
            'purple':           '#714a9a',
            'purple-light':     '#b57ae2',
            'yellow':           '#f5dd9f',
            'green':            '#9ff4b7',
            'pink':             '#f49fe9',
            'blue':             '#6a80d8',
            'navy':             '#3b3ddb',
            'red':              '#e23485',
            'skin':             '#EC897C',
            'gray-darker':      '#111',
            'gray-dark':        '#222',
            'gray':             '#272727',
            'gray-less-light':  '#333',
            'gray-light':       '#555',
            'white':            '#eee',
            'light':            '#aaa',
            'opaque':           'rgba(255, 255, 255, 100)',
            'cyan':             '#6ac2d8',
            'transparent':      'rgba(0, 0, 0, 0)',
        },
        fontFamily: {
            'head': ['"Varela Round"', 'sans-serif'],
            'text': ['"Open Sans"', 'sans-serif'],
        },
        extend: {
            spacing: {
                '1px': '1px',
            },
            width: {
                'txt-or-vw': 'min(36rem, 90vw)',
                'img-or-vw': 'min(42rem, 90vw)',
            },
            maxWidth: {
                'txt-or-vw': 'min(36rem, 90vw)',
                'inp-or-vw': 'min(24rem, 90vw)',
                'img-or-vw': 'min(42rem, 90vw)',
            },
        }
    },
    safelist: [{
        pattern: /hljs+/,
    }],
    plugins: [],
};
