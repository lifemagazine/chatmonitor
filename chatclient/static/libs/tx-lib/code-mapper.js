var CodeMapper = {
	cnsltn : {
		reqTp : function reqTp(reqTp) {
			if (reqTp === 0) {
				return "FCL";
			} else if (reqTp === 1) {
				return "LCL";
			} else if (reqTp === 2) {
				return "EXPRESS";
			} else if (reqTp === 3) {
				return "MOVE";
			}
		},
		transTp : function transTp(transTp) {
			if (transTp === 0) {
				return "Sea";
			} else if (transTp === 1) {
				return "Air";
			} else if (transTp === 2) {
				return "Sea/Air";
			}
		},
		stusCd : function stusCd(stusCd) {
			if (stusCd === -1) {
				return "견적 요청 수령";
			} else if (stusCd === 0) {
				return "견적 중";
			} else if (stusCd === 1) {
				return "견적 완료";
			} else if (stusCd === 2) {
				return "Booking 요청";
			} else if (stusCd === 3) {
				return "완료";
			}
		}
	},

	shprCd :  function shprCd(shprCd) {
		switch(shprCd) {
			case 'ANL': return 'ANL';
			case 'APL': return 'APL';
			case 'CKL': return '천경해운';
			case 'CMA': return 'CMA';
			case 'COA': return 'COSCO';
			case 'CSC': return '중국해운';
			case 'DJS': return '동진상선(주)';
			case 'EMC': return 'EVERGREEN';
			case 'HAS': return '흥아해운';
			case 'HJS': return '한진해운';
			case 'HLC': return 'HAPAG LLOYD';
			case 'HMM': return '현대상선';
			case 'HSD': return 'HAMBURG';
			case 'KKL': return 'K-LINE';
			case 'KMD': return '고려해운';
			case 'MAE': return 'MAERSK';
			case 'MCC': return 'MCC';
			case 'MCS': return 'MERCOSUL';
			case 'MOL': return 'MOL';
			case 'MSC': return 'MSC';
			case 'NSS': return '남성해운';
			case 'NYK': return 'NYK';
			case 'OOL': return 'OOCL';
			case 'PCL': return '범주해운(주)';
			case 'PCS': return '동영해운';
			case 'PIL': return 'PIL';
			case 'SFM': return 'YANG MING';
			case 'SKR': return '장금상선';
			case 'TSL': return '동신선박(주)';
			case 'TYS': return '태영상선(주)';
			case 'UAC': return 'KMCT';
			case 'WHL': return 'WAN HAI';
			case 'YML': return 'YANG MING';
			case 'ZIM': return 'ZIM';
			default : return '';
		}
	}

};