import { useState, useEffect } from "react";
import _ from "lodash";
import Loader from "react-spinners/ClipLoader";
import { css } from "@emotion/core";
import Layout from "./components/Layout";
import FilterTypeButton from "./components/FilterTypeButton"
import Card from "./components/Card";
import BarChart from "../common/BarChart";
import DonutChart from "../common/DonutChart";
import Head from 'next/head'
import { FILTER_TYPE, transformBarData, transformDonutData } from "../common";
import * as API from "./api/covid.api";

const override = css`
  display: block;
  position:absolute;
  top:50%;
  left:50%;
  opacity: 0.4;
  transform: translate(-50%,-50%);
`;



function Index() {
    //State
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState(FILTER_TYPE.GLOBAL);
    const [filteredData, setFilteredData] = useState({});
    const [covid, setCovid] = useState({ belgium: {}, global: {} });
    const [barChart, setBarchart] = useState({});
    const [donutChart, setDonutchart] = useState({});

    const fetchData = async () => {
        setLoading(true);

        const [covidBE, covidGlobal, covidDaily] = await Promise.all([
            API.covidBE(),
            API.covidGlobal(),
            API.covidDaily()
        ]);

        setBarchart(transformBarData(covidDaily.data));

        setCovid({
            belgium: covidBE.data,
            global: covidGlobal.data,
        });

        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        const { belgium, global } = covid;
        let data = {};
        switch (filterType) {
            case FILTER_TYPE.BELGIUM:
                data = belgium;
                break;
            case FILTER_TYPE.GLOBAL:
                data = global;
                break;
        }
        setFilteredData(data);
        setDonutchart(transformDonutData(data));
    }, [filterType, covid]);

    const renderFilterTypeBtn = () => {
        return (
            <div className="filter-type-section">
                <FilterTypeButton
                    filterType={filterType}
                    setFilterType={setFilterType}
                />
            </div>
        )
    }

    const renderChartSection = () => {
        return (
            <div className="covid-stats-section">
                <div className="row">
                    <div className="col-lg-8">
                        <div className="covid-bar-chart-card">
                            <h5>Graphique</h5>
                            <BarChart data={barChart} />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="covid-donut-chart-card">
                            <h5></h5>
                            <DonutChart data={donutChart} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderCardSection = () => {
        const { confirmed, recovered, deaths, lastUpdate } = filteredData;

        return (
            <div className="covid-stats-section">
                <div className="row">
                    <div className="col-lg-4">
                        <Card
                            type="confirmed"
                            title="Cas confirmés"
                            number={confirmed?.value}
                            lastUpdate={lastUpdate}
                        />
                    </div>
                    <div className="col-lg-4">
                        <Card
                            type="recovered"
                            title="Guérisons"
                            number={recovered?.value}
                            lastUpdate={lastUpdate}
                        />
                    </div>
                    <div className="col-lg-4">
                        <Card
                            type="deaths"
                            title="Décès"
                            number={deaths?.value}
                            lastUpdate={lastUpdate}
                        />
                    </div>
                </div>
            </div>
        )
    }


    const renderInfoSection = () => {
        return (
            <div className="covid-stats-section">
                <div className="row">

                    </div>
                    <div className="col-lg">
                        <div className="covid-donut-chart-card text-center">
                            <h5>Restez chez vous, prenez soin de vous et des autres</h5>
<p><a href="https://www.info-coronavirus.be">https://www.info-coronavirus.be</a></p>
                        </div>
                    </div>
                </div>

        )
    }

    if (loading) {
        return (
            <Loader
                size={40}
                css={override}
                color="white"
            />
        )
    }

    return (
        <Layout>
             <Head>
      <title>COVID19 Tracker</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta property="og:image" content="https://covid-be.now.sh/images/logo.png" />
    </Head>
            <div className="top-section">
                <img className="logo" src="images/logo.png" width="230" />
                <p></p>
            </div>
            {renderFilterTypeBtn()}
            {renderCardSection()}
            {renderChartSection()}
            {renderInfoSection()}
        </Layout>
    )
}

export default Index;
