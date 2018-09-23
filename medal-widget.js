window.widget = {
  initialize: async (element_id, sort = 'gold') => {
    let data;
    const gray = '#888b8c';
    // Fetch json data
    try {
      const apiRes = await fetch('https://s3.amazonaws.com/medals-sort/medals.json');
      data = await apiRes.json();

      if (!apiRes.ok) return alert(`There was an error fetching the data: ${JSON.stringify(data)}`);
    } catch (err) {
      return alert(`There was an error fetching the data: ${err}`);
    }

    // Hash of secondary sort parameters to break ties
    // e.g. If sorted by gold, break ties by most silver
    const secondarySort = {
      total: 'gold',
      gold: 'silver',
      sliver: 'gold',
      bronze: 'gold'
    };

    /**
     * Callback for .sort() function to sort by medal
     * @param {Object} a First item in sort callback
     * @param {Object} b Second item in sort callback
     * @param {String} context Sort context gold, silver, etc...
     */
    const sortCallback = (a, b, context) => {
      a.total = a.gold + a.silver + a.bronze;
      b.total = b.gold + b.silver + b.bronze;
      const aSort = a[context];
      const bSort = b[context];
      // Secondary sort used when there is a tie
      const aSecSort = a[secondarySort[context]];
      const bSecSort = b[secondarySort[context]];

      if (aSort === bSort) {
        // If values are the same, countries are tied, use secondary sort
        return bSecSort - aSecSort;
      }

      // regular sort
      return bSort - aSort;
    };

    const container = document.querySelector(element_id);
    const e = React.createElement;

    const MedalTableRow = (props) => {
      const { data: medal, styles } = props;
      return (
        <tr>
          <td style={styles.centered}>{medal.index + 1}</td>
          <td><div className={`flag ${medal.code}`}></div></td>
          <td style={styles.countryCode}>{medal.code}</td>
          <td style={styles.centered}>{medal.gold}</td>
          <td style={styles.centered}>{medal.silver}</td>
          <td style={styles.centered}>{medal.bronze}</td>
          <td style={{...styles.total, ...styles.centered}}>{medal.total}</td>
        </tr>
      )
    }

    class MedalTable extends React.Component {
      styles = {
        tableWrap: {
          padding: 15,
          h3: {
            color: gray,
            fontWeight: '200'
          }
        },
        tableHead: {
          total: {
            color: 'black',
            fontWeight: 'normal'
          }
        },
        tableRow: {
          countryCode: {
            fontWeight: 'bold',
            color: gray,
            width: 75
          },
          total: {
            color: 'black',
            fontWeight: 'bold'
          },
          centered: {
            textAlign: 'center'
          }
        }
      }

      constructor (props) {
        super(props);

        this.state = {
          sort,
          medals: data
        }
      }

      sortedMedals () {
        // return the medals sorted by the sort predicate
        return this.state.medals.sort((a, b) => sortCallback(a, b, this.state.sort)).slice(0, 10);
      }

      resort (context) {
        // Change sorting context on table header click
        this.setState({
          sort: context
        })
      }

      render () {
        return (
          <div style={this.styles.tableWrap}>
            <h3 style={this.styles.tableWrap.h3}>MEDAL COUNT</h3>
            <table>
              <thead>
                <tr>
                  <th colSpan="3"></th>
                  <th onClick={this.resort.bind(this, 'gold')} className={this.state.sort === 'gold' ? 'sorted' : ''}><div className="medal-header" id="gold-header"></div></th>
                  <th onClick={this.resort.bind(this, 'silver')} className={this.state.sort === 'silver' ? 'sorted' : ''}><div className="medal-header" id="silver-header"></div></th>
                  <th onClick={this.resort.bind(this, 'bronze')} className={this.state.sort === 'bronze' ? 'sorted' : ''}><div className="medal-header" id="bronze-header"></div></th>
                  <th style={this.styles.tableHead.total} onClick={this.resort.bind(this, 'total')} className={this.state.sort === 'total' ? 'sorted' : ''}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {this.sortedMedals().map((d, index) => {
                  d = { ...d, index };
                  return (
                    <MedalTableRow data={d} styles={this.styles.tableRow} key={index} />
                  )
                })}
              </tbody>
            </table>
          </div>
        );
      }
    }

    ReactDOM.render(e(MedalTable), container);
  }
}