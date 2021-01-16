import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import stateWrapper from '../../../containers/provider';
import * as _ from 'lodash';
import { withRouter, Link } from 'react-router-dom';


const StackedColumnChart = props => {
    const [state, setState] = useState({
        options: {
            chart: {
                height: 359,
                type: "bar",
                stacked: !0,
                toolbar: {
                    show: 1
                },
                zoom: {
                    enabled: !0
                }
            },
            plotOptions: {
                bar: {
                    horizontal: !1,
                    columnWidth: "15%",
                    // endingShape: "rounded"
                }
            },
            dataLabels: {
                enabled: !1
            },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            },
            colors: ["#556ee6", "#f1b44c", "#34c38f"],
            legend: {
                position: "bottom"
            },
            fill: {
                opacity: 1
            }
        },
        series: props.userStore.state.series
    });

    useEffect(() => {
        if (!_.isEmpty(props.userStore.state.admin.series)) {
            setState({...state, series: props.userStore.state.admin.series});
        }
    }, [props.userStore.state.admin.series]);

    return (
        <React.Fragment>
            <ReactApexChart options={state.options} series={state.series} type="bar" height="359" />
        </React.Fragment>
    );
}

export default withRouter(stateWrapper(StackedColumnChart));

