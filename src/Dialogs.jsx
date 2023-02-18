import PropTypes from "prop-types";

const DialogCreator = (props) => {
	const { dialog, user } = props

	return (
		dialog.map((message, index) => {
			return (
				<div
					className={"container " + (message.user_id === user ? 'darker': '')}
					key={index}
				>
					<p>{message.user_id === user ? `Вы#${message.user_id}`: `Anonymous#${message.user_id}`}</p>
					<p>{message.message}</p>
					<span className="time-right">{new Date(message.time).toLocaleTimeString("en-US")}</span>
				</div>
			)
		})
	)
}

DialogCreator.propTypes = {
	dialog: PropTypes.array.isRequired,
	user: PropTypes.string.isRequired
};

export default DialogCreator