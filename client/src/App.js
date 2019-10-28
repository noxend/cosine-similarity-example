import React from 'react';
import { AutoComplete, Tag } from 'antd';
import axios from 'axios';
import './App.css';

class App extends React.Component {
  state = {
    value: '',
    dataSource: [],
    keywords: []
  };

  componentDidMount = async () => {};

  onSelect = value => {
    if (!this.state.keywords.includes(value)) {
      this.setState({ value: '', keyword: this.state.keywords.push(value) });
    } else {
      this.setState({ value: ''});
    }
  };

  onChange = value => {
    this.setState({ value });
  };

  onSearch = async value => {
    if (value.length === 0) {
      this.setState({ dataSource: [] });
    } else {
      const { data } = await axios.get('/api/keywords', {
        params: { keyword: value }
      });
      this.setState({
        dataSource: data.map(({ skill }) => skill)
      });
    }
  };

  deleteTag = e => {
    const title = e.currentTarget.parentElement.innerText;
    this.setState({
      keywords: this.state.keywords.filter(value => {
        if (value !== title) return value;
      })
    });
  };

  render = () => {
    return (
      <div className="App">
        <AutoComplete
          dataSource={this.state.dataSource.splice(0, 10)}
          style={{ width: 200 }}
          onSelect={this.onSelect}
          onChange={this.onChange}
          value={this.state.value}
          onSearch={this.onSearch}
          placeholder="input here"
          disabled={this.state.keywords.length === 5 ? true : false}
        />
        {this.state.keywords.map(value => {
          return (
            <Tag closable key={value} onClose={this.deleteTag}>
              {value}
            </Tag>
          );
        })}
      </div>
    );
  };
}

export default App;
