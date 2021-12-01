import React, { useEffect, useState } from 'react'
import BitCoin from "../assets/BTC.svg";
import {CaretDownFill,CaretUpFill} from 'react-bootstrap-icons';
export const Widget = () => {
    const [widgetData, setWidgetData] = useState({ volume: "", high: "", low: "", change: "", lastPrice: "" });
    const [wss, setWss] = useState(new WebSocket('wss://api-pub.bitfinex.com/ws/2'));
    useEffect(() => {
        wss.onmessage = (msg) => {
            //            console.log("onmsg called!!! ->> ", msg.data);
            const data = JSON.parse(msg.data);
            if (data?.[1] !== "hb")
                setWidgetData({ volume: data?.[1]?.[7], high: data?.[1]?.[8], low: data?.[1]?.[9], change: data?.[1]?.[4], lastPrice: data?.[1]?.[6] });

        }
        wss.onopen = () => {
            // API keys setup here (See "Authenticated Channels")
            //            console.log("Onopen called !!!===>>>   ");
            wss.send(JSON.stringify({
                event: 'subscribe',
                channel: 'ticker',
                symbol: 'tBTCUSD'
            }))
        }
        wss.onclose = () => {
            //            console.log("connection closed!!!");
        }
        return () => {
            wss.close();
        }
    }, [wss])
    return (
        <div className="trading-data">
            <div className="mainContainer">
                <div className="imageContainer">
                    <img src={BitCoin} alt="bitcoin"/>
                </div>
                <div className="dataContainer">
                    <div className="topContent">
                        <p>Btc/Usd</p>
                        <p><span>{parseFloat(widgetData.lastPrice / 1000).toFixed(0)}</span><span>,</span><span>{parseFloat(widgetData.lastPrice % 1000).toFixed(1)}</span></p>
                    </div>
                    <div className="middleContent">
                        <p><span className="text">Vol</span> <span>{parseFloat(widgetData.volume / 1000).toFixed(0)}</span><span>,</span><span>{parseFloat(widgetData.volume % 1000).toFixed(0)}</span> <span className="btc">BTC</span></p>
                        <p className={widgetData.change > 0 ? "green" : "red"}><span className="absValue">{parseFloat(Math.abs(widgetData.change) / 10).toFixed(2)}</span><span className="carrot">{widgetData.change < 0 ? <CaretDownFill /> :<CaretUpFill />}</span><span className="percentage">({parseFloat(Math.abs(widgetData.change)/1000).toFixed(2)}%)</span></p>
                    </div>
                    <div className="bottomContent">
                        <p><span className="text">Low</span> <span>{parseFloat(widgetData.low / 1000).toFixed(0)}</span><span>,</span><span>{parseFloat(widgetData.low % 1000).toFixed(1)}</span></p>
                        <p><span className="text">High</span> {widgetData.high}</p>
                    </div>
                </div>
            </div>
            <div className="buttonContainer">
                <button type='button' onClick={() => setWss(new WebSocket('wss://api-pub.bitfinex.com/ws/2'))} >Connect</button>
                <button type='button' onClick={() => wss.close()}>Disconnect</button>
            </div>
        </div>
    )
}
