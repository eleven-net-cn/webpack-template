// 是否为本地开发环境
export const isDev = BUILD_ENV === 'development';

// 是否为测试环境
export const isTest = BUILD_ENV === 'test';

// 是否为生产环境
export const isProd = BUILD_ENV === 'production';
