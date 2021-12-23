export const phonePattern = new RegExp('1[0-9]{10}');
export function validPhone(phone: string) {
    return phonePattern.test(phone);
}
// 返回封装
export function toBody(code:number, message: string, data: Object | undefined) {
    return {
        code: code,
        data: data,
        message: message,
    };
}
// 六位数的验证码
export function verifyCode(): string {
    return Math.random().toFixed(6).slice(-6);
}
  