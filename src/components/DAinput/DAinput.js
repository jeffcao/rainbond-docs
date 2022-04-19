import { Input, Form, notification } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import React, { Component } from 'react';
import '../Helm/index.css'


export default class DAinputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: [{ externalIP: '', internalIP: '', name: '' }]
    };
  }
  onRegexChange = (value, index) => {
    const { values } = this.state;
    values[index].externalIP = value;
    this.triggerChange(values);
    this.setValues(values);
  };
  onReplacementChange = (value, index) => {
    const { values } = this.state;
    values[index].internalIP = value;
    this.triggerChange(values);
    this.setValues(values);
  };
  onFlagChange = (value, index) => {
    const { values } = this.state;
    values[index].name = value;
    this.triggerChange(values);
    this.setValues(values);
  };
  setValues(arr) {
    const setArr = arr || [];
    if (!setArr.length) {
      setArr.push({ externalIP: '', internalIP: '', name: '' });
    }
    this.setState({ values: setArr });
  }
  initFromProps(value) {
    const setValue = value
    if (setValue) {
      this.setValues(setValue);
    }
  }
  add = () => {
    const { values } = this.state;
    if (values.length > 100) {
      notification.warning({
        message: '最多添加100个'
      });
      return null;
    }
    this.setState({
      values: values.concat({ externalIP: '', internalIP: '', name: '' })
    });
  };

  remove = index => {
    const { values } = this.state;
    values.splice(index, 1);
    this.setValues(values);
    this.triggerChange(values);
  };
  triggerChange(values) {
    const res = [];
    for (let i = 0; i < values.length; i++) {
      res.push({
        externalIP: values[i].externalIP,
        internalIP: values[i].internalIP,
        name: values[i].name
      });
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(res);
    }
  }

  render() {
    const externalIPPlaceholder = '外部IP';
    const repPlaceholder = '内部IP';
    const namePlaceholder = '节点名称';
    const { values } = this.state;
    return (
      <div>
        {values.map((item, index) => {
          const first = index === 0;
          return (
            <div className="rowsLeft" key={index}>
              <div className="rows">
                <span className="spanTitle">节点配置</span>
                <Input
                  name="externalIP"
                  onChange={e => {
                    this.onRegexChange(e.target.value, index);
                  }}
                  
                  className="DAinputs"
                  value={item.externalIP}
                  placeholder={externalIPPlaceholder}
                />
                <Input
                  name="internalIP"
                  onChange={e => {
                    this.onReplacementChange(e.target.value, index);
                  }}
                  className="DAinputs"
                  value={item.internalIP}
                  placeholder={repPlaceholder}
                />
                <Input
                  name="namePlaceholder"
                  onChange={e => {
                    this.onFlagChange(e.target.value, index);
                  }}
                  className="DAinputs"
                  value={item.namePlaceholder}
                  placeholder={namePlaceholder}
                />
                {
                  first ? (
                    <PlusCircleOutlined onClick={() => this.add()} className="icons" />
                  ):(
                    <MinusCircleOutlined onClick={() => this.remove(index)} className="icons"/>
                  )
                }
              </div>
            </div>
          );
        })
        }
      </div >
    );
  }
}