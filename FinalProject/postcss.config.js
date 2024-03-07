// postcss.config.js
// export default {
//     plugins: {
//         'postcss-import': {},
//         tailwindcss: {},
//         autoprefixer: {},
//     }
// }

import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [postcssImport(), tailwindcss(), autoprefixer()],
};
