import './../grid.css';
import './../Nanum.css';
import './../evaluation.css'
import axios from '../axios-auth';
import React, { Component } from 'react';

class EvaluationPost extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
            <h1 className="subjectstyle">{this.props.title}</h1>
                <p className="fontstyle">
                    {this.props.description.split("\n").map((str) => {
                        return (
                            <p className="entrystyle">{str}</p>
                        )
                    })}
                </p>
            </div>
        )
    }
}

class EvaluationPosts extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let posts = this.props.data.map((item, index) =>
            <div>
                <EvaluationPost title={item.fields.title} description={item.fields.description}/>
                <br />
            </div>
        );

        return (
            <div>
                {posts}
            </div>
        )
    }
}

class Evaluation extends Component {
    constructor(props){
        super(props);

        this.state = {
            data: [],
        };
    }

    componentDidMount () {
        axios.get('/ch102/evaluation/')
            .then((response) => {
                const result = JSON.parse(response.data);

                this.setState({
                    data: result,
                })
            })
    }

    render() {
        return (
            <div className="section" style={{paddingBottom: 48, paddingTop: 30}}>
                <div className="row">
                    <div className="col span-3-of-3">
                        <EvaluationPosts data={this.state.data} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Evaluation;