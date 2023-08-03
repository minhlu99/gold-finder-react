import { useState } from "react"
import MatrixTable from "./MatrixTable"


export default function Input({ onStart } : { onStart: (size: string) => void }) {
    const [ value, setValue ] = useState("6")

    return (
        <div>
        <div className="input-container">
        <div className="input-group">
            <div className="input-wrapper">
                <label htmlFor="rows" className="inp">
                    <span className="label">Choose Input size (n x n):</span>
                    <span className="focus-bg"></span>
                </label>

                <select id="rows" className="select-input" onChange={(event) => {
                    setValue(event.target.value)
                }}>
                    <option value="6">6 x 6 (Easy)</option>
                    <option value="8">8 x 8 (Easy)</option>
                    <option value="10">10 x 10 (Normal)</option>
                    <option value="12">12 x 12 (Normal)</option>
                    <option value="14">14 x 14 (Normal)</option>
                    <option value="15">15 x 15 (Hard)</option>
                    <option value="16">16 x 16 (Hard)</option>
                    <option value="17">17 x 17 (Hard)</option>
                    <option value="18">18 x 18 (Expert)</option>
                    <option value="20">20 x 20 (Expert)</option>
                </select>
                <button id="play-btn" onClick={() => {
                    // console.log(value)
                    onStart(value)
                }} className="glow-on-hover">
                Play!</button>
            </div>
        </div>
    </div>

    {/* <MatrixTable rows={value} cols={value}/> */}
        </div>
    )
}
