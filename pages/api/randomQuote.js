import allQuotes from "../../quotes.json";

/*
An API route, a lambda (serverless functions) running on Node to provide an API endpoint
at /api/randomQuote
 */
export default (req, res) => {
  const { author } = req.query;
  let quotes = allQuotes;

  // Filter the quotes where the 'author' query string value is at least part of the
  // author name
  if (author) {
    quotes = quotes.filter(quote =>
      quote.author.toLowerCase().includes(author.toLowerCase())
    );
  }
  // If the author is not found, filter by 'unknown' author
  if (!quotes.length) {
    quotes = allQuotes.filter(
      quote => quote.author.toLowerCase() === "unknown"
    );
  }

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  res.status(200).json(quote);
};
