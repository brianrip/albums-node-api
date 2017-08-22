module.exports = {
	test: {
		environment: 'test',
		mongo: {
			host: '127.0.0.1',
			port: '27017',
			database: 'api_test',
		},
		server: {
			host: '127.0.0.1',
			port: '3001'
		}
	},
	local: {
		environment: 'local',
		mongo: {
			host: '127.0.0.1',
			port: '27017',
			database: 'api_local',
		},
		server: {
			host: '127.0.0.1',
			port: '3000'
		}
	}
};
