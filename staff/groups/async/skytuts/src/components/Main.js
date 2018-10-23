import React, { Component } from 'react'

import Card from './Card'

import logicUdacity from '../logic/udacity'
import filterCourses from '../logic/filter'

class Main extends Component {

    state = {
        courses: [],
        tracks: [],
        error: null
    }


    filterCoursesByTrack = (track) => {
        this.setState({ courses:  filterCourses().byTrack(track)})
    }

    filterCoursesByLevel = (level) => {
        this.setState({ courses:  filterCourses(this.state.courses).byLevel(level)})
    }


    listCourses = () => {
        try {
            logicUdacity.getCourses()
                .then(() => {
                    const data = JSON.parse(sessionStorage.getItem('courses'))
                    this.setState({ 
                        courses: data.courses || [],
                        tracks: data.tracks || [],
                    })
                })
                .catch(error => this.setState({ error: error.message }))
        } catch (error) {
            this.setState({ error: error.message })
        }
    }

    componentWillMount() {
        const data = JSON.parse(sessionStorage.getItem('courses'))
        if (data) {
            this.setState({ 
                courses: data.courses || [],
                tracks: data.tracks || [],
            })
        } else {
            this.listCourses();
        }
        
    }

    render() {
        return (
            <main>
                <section className="list-container">

                {(this.state.tracks || []).map((track, index) => <span onClick={() => this.filterCoursesByTrack(track)} key={index}>{track.name}</span>)}
                    <span onClick={() => this.filterCoursesByLevel('beginner')}>beginner</span>
                    <span onClick={() => this.filterCoursesByLevel('intermediate')}>intermediate</span>
                    <span onClick={() => this.filterCoursesByLevel('advanced')}>advanced</span>
                {this.state.error &&
                    <p>{this.state.error}</p>
                }

                </section>

                < section className="cards-container" >
                    {(this.state.courses || []).map((course, index) => <Card course={course} key={index} />)}
                </section >
            </main >
        )
    }
}

export default Main