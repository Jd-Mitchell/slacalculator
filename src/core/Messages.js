class Message {
    // static #success = new Message('SUCCESS', 'SUCCESS_')
    constructor(status, code, name, message, data = null) {
        this.status = status;
        this.code = code;
        this.name = name;
        this.message = message;
        this.data = data;
        this.customError = true;
    }
    static success(data){
        return new Message('SUCCESS', 'SUCCESS_CODE', 'SUCCESS', 'SUCCESS!', data)
    }
    static throwError(classSource, code, data = null) {
        const errorData = classSource.errors.find((errorData) => errorData.code === code);
        throw new Message(
            'FAIL',
            errorData.code,
            errorData.name,
            errorData.message,
            data,
        );
    }
}

export { Message };
