# Olympic Medals Sort

A widget written in React to sort countries by the number of medals won.

## Concept

The widget is initialized with an id and a default sort:
```html
<script src="medal-widget.js" type="text/babel"></script>
<script type="text/babel">
  widget.initialize('#medal-widget', 'gold');
</script>
```

The widget will sort the countries by most medals won using the given sort. If there is a tie, the countries are sorted by the next-nearest medal using the following hash:
```javascript
// Hash of secondary sort parameters to break ties
// e.g. If sorted by gold, break ties by most silver
const secondarySort = {
  total: 'gold',
  gold: 'silver',
  sliver: 'gold',
  bronze: 'gold'
};
```

The user can also click on the table headers to change sort

example:

![gif](https://i.imgur.com/UrPXpS6.gif)

## Development

```bash
# Install dependencies
$ npm install
# Run browser sync server
$ npm start
```