import React from "react";
// react plugin used to create charts
import { Bar } from "react-chartjs-2";

//import doencaService from "services/doencaService";
const options = {
    legend: {
        display: false
    },
    tooltips: {
        callbacks: {
           label: function(tooltipItem) {
                return tooltipItem.yLabel;
           }
        }
    },
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    precision: 0,   
                },
            },
        ],
    },
};

const quantidade = "5";

class VerticalBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ranking: [],
            aguardandoEnvio: true,
            data: {},
        };
    }
    /* carregarRanking = () => {
        doencaService.getRanking(quantidade).then((resposta) => {
            this.setState({ ranking: resposta, aguardandoEnvio: false });
            const arrayLabels = this.state.ranking;
            const datasLabels = arrayLabels.map((Label) => Label.nome);
            const arrayDatas = this.state.ranking;
            const dados = arrayDatas.map((dado) => dado.cidadaos_count);
            let data = {
                labels: datasLabels,
                datasets: [
                    {
                        data: dados,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            };
            this.setState({data: data})
        });
    }; */

    componentDidMount() {
        //this.carregarRanking();
    }

    render() {
        return (
            <>
                {!this.aguardandoEnvio && (
                    <Bar data={this.state.data} options={options} />
                )}
            </>
        );
    }
}

export default VerticalBar;
