import axios from '../axios-auth';
import React, { Component } from 'react';
import '../grid.css';
import './infostyle.css';
import Modal from 'react-modal';
import MediaQuery from 'react-responsive';

import Calendar from './Calendar';
import CalendarHead from "./CalendarHead";
import DateInfo from "./DateInfo";
import close from "./img/close.png";

function getNextMonth(month) {
    if (month == 12)
        return 1;

    return month+1;
}

function getPrevMonth(month) {
    if (month == 1)
        return 12;

    return month-1;
}

const dayweek = ['Sun', 'Mon', 'Tue', 'Wed', "Thu", "Fri", "Sat"];

const dayofweek = dayweek.map((item)=>{
    return (
        <div className = "dayofweek">
            {item}
        </div>
    );
});

const modalstyle = {
    overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(20, 20, 20, 0.25)'
  },
    content : {
    position                   : 'absolute',
    width : '300px',
    height : '380px',
    top                        : '50%',
    left                       : '50%',
    marginTop : '-230px',
    marginLeft : '-170px',
    background                 : '#fff',
    borderRadius               : '30px',
    overflow :'hidden'
  }
}

const closebutton = {
    position : 'absolute',
    top : '20px',
    right : '20px',
    width : '25px',
    height : '25px',
    opacity : '0.5',
    cursor : 'pointer'
}

class Schedule extends Component {
    constructor(props){
        super(props);

        var today = new Date();
        var currday = today.getDate();
        var currYear = today.getFullYear();
        var currMonth = today.getMonth()+1;

        this.state = {
            Viewday : currday,
            Year : currYear,
            Month : currMonth,
            hasQuiz : false,
            hasExam : false,
            hasRecitation : false,
            Quiz : "q",
            Exam : "e",
            Recitation : "r",
            modalIsOpen : false,
            data: [],
        };

        this.increaseMonth = this.increaseMonth.bind(this);
        this.decreaseMonth = this.decreaseMonth.bind(this);
        this.setPost = this.setPost.bind(this);
        this.setModal = this.setModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount () {
        axios.get('/'+this.props.classnum+'/schedule/')
            .then((response) => {
                const result = JSON.parse(response.data);
                console.log(response.data)

                result.map((item, index) => {
                    let parsed = item.fields.event_date.split("T")[0].split("-");
                    if (parseInt(parsed[0]) == this.state.Year &&
                        parseInt(parsed[1]) == this.state.Month &&
                        parseInt(parsed[2]) == this.state.Viewday
                    ) {
                        if (item.fields.type == "quiz") {
                            this.setState({
                                hasQuiz: true,
                                Quiz: item.fields.description,
                            })
                        }
                        if (item.fields.type == "exam") {
                            this.setState({
                                hasExam: true,
                                Exam: item.fields.description,
                            })
                        }
                        if (item.fields.type == "recitation") {
                            this.setState({
                                hasRecitation: true,
                                Recitation: item.fields.description,
                            })
                        }
                    }
                });

                this.setState({
                    data: result,
                })
            })
    }

    decreaseMonth () {
        var prevMonth = this.state.Month;
        var prevYear = this.state.Year;
        if (this.state.Month == 1)
            prevYear -= 1;
        prevMonth = getPrevMonth(prevMonth);

        this.setState ({
            Month : prevMonth,
            Year : prevYear
        });
    }

    increaseMonth () {
        var nextMonth = this.state.Month;
        var nextYear = this.state.Year;
        if (this.state.Month == 12)
            nextYear += 1;
        nextMonth = getNextMonth(nextMonth);

        this.setState ({
            Month : nextMonth,
            Year : nextYear,
        });
    }

    setPost (day, hasquiz, quiz, hasexam, exam, hasrecitation, recitation) {
        // this.setState ({
        //     Post : post
        // })
        this.setState ({
            Viewday : day,
            hasQuiz : hasquiz,
            Quiz : quiz,
            hasExam : hasexam,
            Exam : exam,
            hasRecitation : hasrecitation,
            Recitation : recitation
        })
    }

    openModal() {
        this.setState({modalIsOpen : true});
    }

    afterOpenModal() {
    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }

    setModal (day, hasquiz, quiz, hasexam, exam, hasrecitation, recitation) {
        // this.setState ({
        //     Post : post,
        //     modalIsOpen : true
        // })
        this.setState ({
            Viewday : day,
            hasQuiz : hasquiz,
            Quiz : quiz,
            hasExam : hasexam,
            Exam : exam,
            hasRecitation : hasrecitation,
            Recitation : recitation,
            modalIsOpen : true
        })
    }

    render () {
        return (
            <div className = "section">
                <div className = "row" style = {{marginTop : '40px'}}>
                    <div className = "col span-8-of-12">
                        <CalendarHead Month={this.state.Month}
                                      Year={this.state.Year}
                                      increaseMonth={this.increaseMonth}
                                      decreaseMonth={this.decreaseMonth}/>
                        {dayofweek}
                        <div className = "hbar"/>
                        <Calendar Month={this.state.Month}
                                  Year={this.state.Year}
                                  setPost={this.setPost}
                                  setModal={this.setModal}
                                  Viewday = {this.state.Viewday}
                                  AllSchedule = {this.state.data}
                                  />
                    </div>
                    <div className = "bar"/>
                    <MediaQuery query = "(min-Width : 900px)">
                        <div className="col span-3-of-12" style = {{paddingTop : '11%', marginLeft : '13px'}}>
                            <DateInfo hasQuiz={this.state.hasQuiz}
                                      hasExam={this.state.hasExam}
                                      hasRecitation={this.state.hasRecitation}
                                      Quiz={this.state.Quiz}
                                      Exam={this.state.Exam}
                                      Recitation={this.state.Recitation}
                                      AllSchedule = {this.state.data}
                                      Viewmonth={this.state.Month}
                                      Viewday = {this.state.Viewday}
                                      />
                        </div>
                    </MediaQuery>
                    <MediaQuery query = "(max-Width : 900px)">
                        <Modal isOpen = {this.state.modalIsOpen} onRequestClose={this.closeModal} style={modalstyle}>
                            <p ref={subtitle => this.subtitle = subtitle}>
                                <DateInfo Viewday={this.state.Viewday}
                                					hasQuiz={this.state.hasQuiz}
                                          hasExam={this.state.hasExam}
                                          hasRecitation={this.state.hasRecitation}
                                          Quiz={this.state.Quiz}
                                          Exam={this.state.Exam}
                                          Recitation={this.state.Recitation}
                                          Viewmonth = {this.state.Month}
                                          />
                            </p>
                            <img src={close} style = {closebutton} onClick = {this.closeModal}/>
                        </Modal>
                    </MediaQuery>
                </div>
            </div>
        );
    }
}

export default Schedule;