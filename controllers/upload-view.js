const path = require("path");

const home = (req, res) => {
    return res.sendFile(path.join(`${__dirname}/../views/upload-image.html`));
};

module.exports = {
    getHome: home
};