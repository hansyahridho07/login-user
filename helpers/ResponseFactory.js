module.exports = {
    GeneralError(message) {
        return {
            success: false,
            message: message,
            data: null,
        }
    },

    GeneralSuccess(message, data) {
        return {
            success: true,
            message: message,
            data: data,
        }
    },
}
