export const isDev = process.env.BUILD_ENV === 'development';

export const isTest = process.env.BUILD_ENV === 'test';

export const isProd = process.env.BUILD_ENV === 'production';
