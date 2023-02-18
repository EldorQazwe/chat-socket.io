import PropTypes from "prop-types";
import React from "react";

const DialogCreatorMemo = (props) => {
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

const DialogCreator = React.memo(DialogCreatorMemo);

DialogCreator.propTypes = {
	dialog: PropTypes.array.isRequired,
	user: PropTypes.string.isRequired
};

export default DialogCreator