module.exports = {
  serverUrl:
    process.env.NODE_ENV === "production"
      ? "https://ceed64a643de.ngrok.io"
      : "https://ceed64a643de.ngrok.io",
};
