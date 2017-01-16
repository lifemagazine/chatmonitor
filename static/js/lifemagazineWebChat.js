
	var MsgHeader = React.createClass({
		getGeneralInquiryForm: function() {
			if (this.props.type == 'generalQuiry') {
				// do nothing
			} else {
				this.props.router.navigate("generalinquiry", {trigger: true});
			}
		},
		getSendErrorMsgForm: function() {
			if (this.props.type == 'selectErrorType') {
				// do nothing
			} else {
				this.props.router.navigate("errortype", {trigger: true});
			}
		},
		render: function() {
			var generalInquiryClassName, sendErrorMsgClassname;
			if (this.props.type == 'generalQuiry') {
				generalInquiryClassName = "lifemagazine_msg_general_btn";
				sendErrorMsgClassname = "lifemagazine_msg_error_btn";
			} else {
				generalInquiryClassName = "lifemagazine_msg_general_btn_reverse";
				sendErrorMsgClassname = "lifemagazine_msg_error_btn_reverse";
			}
			console.log('this.props.type: ' + this.props.type);
			return React.DOM.div({className: 'lifemagazine_msg_header'},
				React.DOM.button({className: generalInquiryClassName, onClick: this.getGeneralInquiryForm}, '일반 문의'),
				React.DOM.button({className: sendErrorMsgClassname, onClick: this.getSendErrorMsgForm}, '오류 신고')
			);
		}
	});

	var GeneralInquiryContent = React.createClass({
		sendInquiry: function() {
			var formData = {
				name: this.refs.name.getDOMNode().value.trim(),
				email: this.refs.email.getDOMNode().value.trim(),
				phone: this.refs.phone.getDOMNode().value.trim(),
				msg: this.refs.msg.getDOMNode().value.trim()
			};
			if (formData.name.length == 0) {
				alert('문의하시는 분의 이름을 기입해 주세요.');
				$('.lifemagazine_msg_body_name_input').focus();
				return;
			} else if (formData.phone.length == 0 && formData.email.length == 0) {
				alert('문의하시는 분의 연락처(이메일 또는 전화번호)를 기입해 주세요.');
				$('.lifemagazine_msg_body_email_input').focus();
				return;
			} else if (formData.msg.length == 0 ) {
				alert('문의하실 내용을 기입해 주세요.');
				$('.lifemagazine_msg_body_msg_input').focus();
				return;
			}
			console.log('send general inquiry => ' + JSON.stringify(formData));
			$.ajax({
				url: '/inquiry',
				async: false,
				type: "POST",
				data : JSON.stringify(formData),
				contentType: "application/json; charset=utf-8",
				success: function(data) {
					alert('담당자에게 전달하였습니다. 감사합니다.');
					$('.lifemagazine_msg_body_name_input').val('');
					$('.lifemagazine_msg_body_email_input').val('');
					$('.lifemagazine_msg_body_phone_input').val('');
					$('.lifemagazine_msg_body_msg_input').val('');
				},
				error: function(err) {
					console.log(err);
					alert(err);
				}
			});
		},
		render: function() {
			return React.DOM.div({className: 'lifemagazine_msg_body'},
				React.DOM.div({className: 'lifemagazine_msg_body_top_label'},
					React.DOM.div({className: 'lifemagazine_msg_body_top_label_1'}, '문의사항 / 요청사항 / 개선사항'),
					React.DOM.div({className: 'lifemagazine_msg_body_top_label_2'}, ' 등을 남겨주시면'),
					React.DOM.div({className: 'lifemagazine_msg_body_top_label_3'}, '신속하게 답변 드리겠습니다.')
				),
				React.DOM.div({className: 'lifemagazine_msg_body_name'},
					React.DOM.div({className: 'lifemagazine_msg_body_name_label'}, '이름'),
					React.DOM.input({type: 'text', placeholder: 'Your name here', className: 'lifemagazine_msg_body_name_input', ref: 'name'})
				),
				React.DOM.div({className: 'lifemagazine_msg_body_middle'},
					React.DOM.div({className: 'lifemagazine_msg_body_middle_label'}, '답변 받을 연락처를 남겨주세요(이메일 또는 전화번호)')
				),
				React.DOM.div({className: 'lifemagazine_msg_body_email'},
					React.DOM.div({className: 'lifemagazine_msg_body_email_label'}, '이메일'),
					React.DOM.input({className: 'lifemagazine_msg_body_email_input', type: 'text', ref: 'email'})
				),
				React.DOM.div({className: 'lifemagazine_msg_body_phone'},
					React.DOM.div({className: 'lifemagazine_msg_body_phone_label'}, '전화번호'),
					React.DOM.input({className: 'lifemagazine_msg_body_phone_input', type: 'text', ref: 'phone'})
				),
				React.DOM.div({className: 'lifemagazine_msg_body_msg'},
					React.DOM.textarea({className: 'lifemagazine_msg_body_msg_input', cols: '40', placeholder:'메세지를 입력 바랍니다.', ref: 'msg'})
				),
				React.DOM.div({className: 'lifemagazine_msg_body_submit'},
					React.DOM.button({className: 'lifemagazine_msg_body_submit_btn', onClick: this.sendInquiry}, '메세지 보내기')
				)
			);
		}
	});

	var SelectionErrorTypeContent = React.createClass({
		selectDataError: function(errorType) {
			console.log('selectDataError');
			this.props.router.navigate("dataerror", {trigger: true});
		},
		selectViewError: function(errorType) {
			console.log('selectViewError');
			this.props.router.navigate("viewerror", {trigger: true});
		},
		selectOtherError: function(errorType) {
			console.log('selectOtherError');
			this.props.router.navigate("othererror", {trigger: true});
		},
		render: function() {
			return React.DOM.div({className: 'lifemagazine_msg_body'},
				React.DOM.div({className: 'lifemagazine_msg_body_top_label'},
					React.DOM.div({className: 'lifemagazine_msg_body_top_label_1'}, '사용에 불편을 드려 죄송합니다.'),
					React.DOM.div({className: 'lifemagazine_msg_body_top_label_3'}, '신속히 조치하도록 하겠습니다.')
				),
				React.DOM.div({className: 'lifemagazine_msg_error_dataerror', onClick: this.selectDataError},
					React.DOM.div({className: 'lifemagazine_msg_error_label_1'}, '데이터 오류'),
					React.DOM.div({className: 'lifemagazine_msg_error_label_2'}, '데이터가 다르거나, 누락되었습니다.')
				),
				React.DOM.div({className: 'lifemagazine_msg_error_viewerror', onClick: this.selectViewError},
					React.DOM.div({className: 'lifemagazine_msg_error_label_1'}, '화면 오류'),
					React.DOM.div({className: 'lifemagazine_msg_error_label_2'}, '화면이 깨지거나 클릭이 안됩니다.')
				),
				React.DOM.div({className: 'lifemagazine_msg_error_othererror', onClick: this.selectOtherError},
					React.DOM.div({className: 'lifemagazine_msg_error_label_1'}, '기타 오류'),
					React.DOM.div({className: 'lifemagazine_msg_error_label_2'}, '기타 이유로 사용이 불편합니다.')
				),
				React.DOM.div({className: 'lifemagazine_msg_body_dummy'}, null),
				React.DOM.div({className: 'lifemagazine_msg_body_submit'},
					React.DOM.button({className: 'lifemagazine_msg_body_submit_btn'}, '오류신고하기')
				)
			);
		}
	});

	var SendErrorMsgContent = React.createClass({
		getTitle1: function() {
			console.log('this.props.errorType: ' + this.props.errorType);
			if (this.props.errorType == 'dataError') {
				return "데이터 오류";
			} else if (this.props.errorType == 'viewError') {
				return "화면오류";
			} else if (this.props.errorType == 'otherError') {
				return "기타 오류";
			}
		},
		getTitle2: function() {
			console.log('this.props.errorType: ' + this.props.errorType);
			if (this.props.errorType == 'dataError') {
				return "데이터가 다르거나, 누락되었습니다.";
			} else if (this.props.errorType == 'viewError') {
				return "화면이 깨지거나 클릭이 안됩니다.";
			} else if (this.props.errorType == 'otherError') {
				return "기타 이유로 사용이 불편합니다.";
			}
		},
		sendErrorMsg: function() {
			console.log('sendErrorMsg');
			var formData = {
				errortype: this.props.errorType,
				msg: this.refs.msg.getDOMNode().value.trim()
			};
			 if (formData.msg.length == 0 ) {
				alert('문의하실 내용을 기입해 주세요.');
				$('.lifemagazine_msg_error_msg_input').focus();
				return;
			}
			console.log('send error msg => ' + JSON.stringify(formData));
			$.ajax({
				url: '/errorreport',
				async: false,
				type: "POST",
				data : JSON.stringify(formData),
				contentType: "application/json; charset=utf-8",
				success: function(data) {
					alert('담당자에게 전달하였습니다. 감사합니다.');
					$('.lifemagazine_msg_error_msg_input').val('');
				},
				error: function(err) {
					console.log(err);
					alert(err);
				}
			});
		},
		render: function() {
			var title1 = this.getTitle1();
			var title2 = this.getTitle2();
			return React.DOM.div({className: 'lifemagazine_msg_body'},
				React.DOM.div({className: 'lifemagazine_msg_body_top_label'},
					React.DOM.div({className: 'lifemagazine_msg_body_top_label_1'}, '사용에 불편을 드려 죄송합니다.'),
					React.DOM.div({className: 'lifemagazine_msg_body_top_label_3'}, '신속히 조치하도록 하겠습니다.')
				),
				React.DOM.div({className: 'lifemagazine_msg_error_dataerror'},
					React.DOM.div({className: 'lifemagazine_msg_error_label_1'}, title1),
					React.DOM.div({className: 'lifemagazine_msg_error_label_2'}, title2)
				),
				React.DOM.div({className: 'lifemagazine_msg_error_msg'},
					React.DOM.textarea({className: 'lifemagazine_msg_error_msg_input', cols: '40', placeholder:'오류에 대한 상세설명을 남겨주세요.', ref: 'msg'})
				),
				React.DOM.div({className: 'lifemagazine_msg_body_submit'},
					React.DOM.button({className: 'lifemagazine_msg_body_submit_btn', onClick: this.sendErrorMsg}, '오류신고하기')
				)
			);
		}
	});

