import "../../../assets/test.css";

export default function Timeline() {
    return (
        <div className="timeline-container">
            <div className="timeline">
                {/* Main timeline */}
                <div className="bar main"></div>

                {/* Sub-bars with different top values */}
                <div className="bar sub" style={{ left: "8%", width: "10%", top: "20px" }}>
                    <span className="label">8 - 11</span>
                </div>
                <div className="bar sub small" style={{ left: "37%", width: "6%", top: "40px" }}>
                    <span className="label">9 - 9:30</span>
                </div>
                <div className="bar sub small" style={{ left: "42%", width: "6%", top: "60px" }}>
                    <span className="label">10 - 10:30</span>
                </div>
                <div className="bar sub" style={{ left: "58%", width: "12%", top: "80px" }}>
                    <span className="label">14 - 20</span>
                </div>
                <div className="bar sub small" style={{ left: "66%", width: "6%", top: "100px" }}>
                    <span className="label">16 - 18</span>
                </div>
            </div>

            {/* Time Labels */}
            <div className="time-labels">
                <span>00</span>
                <span>8</span>
                <span>9</span>
                <span>9:30</span>
                <span>10</span>
                <span>10:30</span>
                <span>11</span>
                <span>14</span>
                <span>16</span>
                <span>18</span>
                <span>20</span>
                <span>24</span>
            </div>
        </div>
    );
}