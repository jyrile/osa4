const dummy = blogs => 1;

const totalLikes = blogs => blogs.reduce((total, item) => total + item.likes, 0);

const favoriteBlog = blogs =>
        blogs.reduce((previous, current) => (previous.likes > current.likes ? previous : current), 0);

module.exports = {
        dummy,
        totalLikes,
        favoriteBlog,
};
