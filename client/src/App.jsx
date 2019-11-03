import React from 'react';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  state = {
    value: '',
    keywords: [],
    slctdKeywords: [],
    focus: 0,
    isFocus: false,
    alreadySlctd: null
  };

  componentDidMount = async () => {};

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevState.value !== this.state.value) {
      if (this.state.value.length === 0) {
        this.setState({ keywords: [], focus: 0 });
      } else {
        const { data } = await axios.get('/api/keywords', {
          params: { keyword: this.state.value }
        });
        this.setState({
          keywords: data.map(({ keyword }) => keyword)
        });
      }
    }
  };

  onChange = e => {
    this.setState({ value: e.target.value });
  };

  deleteTag = e => {
    const title = e.currentTarget.innerText;
    this.setState({
      slctdKeywords: this.state.slctdKeywords.filter(value => {
        if (value !== title) return value;
      })
    });
  };

  onKeyDown = e => {
    if (this.state.keywords.length !== 0) {
      switch (e.keyCode) {
        case 38:
          this.setState({
            focus: this.state.focus - 1 === -1 ? this.state.keywords.length - 1 : this.state.focus - 1
          });
          break;
        case 40:
          this.setState({
            focus: this.state.focus + 1 === this.state.keywords.length ? 0 : this.state.focus + 1
          });
          break;
        case 13:
          const value = this.state.keywords[this.state.focus];
          if (!this.state.slctdKeywords.includes(value)) {
            this.state.slctdKeywords.push(value);
            this.setState({ value: '', slctdKeywords: this.state.slctdKeywords, focus: 0 });
          } else {
            const index = this.state.slctdKeywords.indexOf(value);
            this.setState({ alreadySlctd: index });
          }
          break;
        default:
          break;
      }
    }
  };

  onClick = e => {
    const value = e.currentTarget.innerText;
    if (!this.state.slctdKeywords.includes(value)) {
      this.state.slctdKeywords.push(value);
      this.setState({ value: '', slctdKeywords: this.state.slctdKeywords, focus: 0 });
    } else {
      const index = this.state.slctdKeywords.indexOf(value);
      this.setState({ alreadySlctd: index });
    }
  };

  onFocus = e => {
    console.log('as');
  };

  render = () => {
    return (
      <div className="nav">
        <div className="search">
          <div
            style={{
              boxShadow: `${
                this.state.isFocus ? '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' : ''
              }`
            }}
          >
            <div className="input">
              <div className="kwrds__tags">
                {this.state.slctdKeywords.map((keyword, index) => {
                  return (
                    <div
                      className={`kwrds__tag ${index === this.state.alreadySlctd ? 'already__slctd' : ''}`}
                      key={keyword}
                      onClick={this.deleteTag}
                    >
                      {keyword}
                    </div>
                  );
                })}
              </div>
              <input
                type="text"
                onChange={this.onChange}
                name="input"
                value={this.state.value}
                onKeyDown={this.onKeyDown}
                onFocus={() => {
                  this.setState({ isFocus: true });
                }}
                onBlur={() => {
                  this.setState({ isFocus: false });
                }}
                placeholder="Виберіть свої навички"
              />
            </div>
            {this.state.keywords.length > 0 && (
              <div className="keywords__list">
                {this.state.keywords.map((value, index) => {
                  return (
                    <div
                      key={value}
                      onClick={this.onClick}
                      className={`list__item${index === this.state.focus ? '--active' : ''}`}
                    >
                      {value}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
}

export default App;
