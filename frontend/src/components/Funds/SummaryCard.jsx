export default function SummaryCard({

    title,
    amount,
    green

}) {

    return (

        <div className="summary-card">

            <h4>{title}</h4>

            <h2 className={green ? "green" : ""}>
                {amount}
            </h2>

        </div>

    )

}