import {uploadToS3} from './src/s3-utils'
import AWS from 'aws-sdk'
import babel from 'gulp-babel'
import dotenv from 'dotenv'
import fs from 'fs'
import gulp from 'gulp'
import gutil from 'gulp-util'
import install from 'gulp-install'
import lodash from 'lodash'
import pkg from './package'
import reactifier from './src/index'
import rename from 'gulp-rename'
import rimraf from 'rimraf'
import runSequence from 'run-sequence'
import sass from 'gulp-sass'
import zip from 'gulp-zip'

const LAMBDA_FUNCTION = 'reactifier'

dotenv.load()

gulp.task('default', ['build', 'run'])

gulp.task('build', done => {
  runSequence(
    'build:clean',
    [
      'build:js',
      'build:media',
      'build:sass',
      'build:deps',
      'build:env',
    ],
    'build:zip',
  done)
})

gulp.task('deploy', done => {
  runSequence('build', 'deploy:upload', done)
})

gulp.task('run', ['build:js'], () => {
  // The reactifier function returns a promise, which we can pass to gulp
  return reactifier()
})

gulp.task('build:clean', done => {
  rimraf('dist', done)
})

gulp.task('build:js', () => {
  // Transpile es6 to the dist directory
  return gulp.src('src/**/*.js?(x)')
    .pipe(babel())
    .pipe(gulp.dest('dist'))
})

gulp.task('build:media', () => {
  return gulp.src(['media/**/*.*', '!media/sass/*'])

    // Upload the files to S3
    .pipe(uploadToS3())
})

gulp.task('build:sass', () => {
  return gulp.src('media/sass/**/*.scss', {base: '.'})

    // First compile the sass
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))

    // Rename the file to change the directory to 'css'
    .pipe(rename(path => {
      path.dirname = path.dirname.replace('/sass', '/css')
    }))

    // Then upload the files to S3
    .pipe(uploadToS3())
})

gulp.task('build:deps', () => {
  return gulp.src('package.json')
    .pipe(gulp.dest('dist'))
    .pipe(install({production: true}))
})

gulp.task('build:env', () => {
  return gulp.src('.prod.env')
    .pipe(rename('.env'))
    .pipe(gulp.dest('dist'))
})

gulp.task('build:zip', () => {
  return gulp.src(['dist/**/*', 'dist/.*'])
    .pipe(zip(`reactifier.${pkg.version}.zip`))
    .pipe(gulp.dest('build'))
})

gulp.task('deploy:upload', done => {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.AWS_PROFILE,
  })

  AWS.config.region = 'us-east-1'

  const lambda = new AWS.Lambda()

  lambda.getFunction({FunctionName: LAMBDA_FUNCTION}, (err, data) => {
    if (err) {
      if (err.statusCode === 404) {
        gutil.log(
          'Unable to find lambda function ' + LAMBDA_FUNCTION + '. Verify the ' +
          'lambda function name and AWS region are correct.'
        )
      } else {
        gutil.log(`AWS API request failed: ${err}`)
      }
    }

    const current = data.Configuration
    const config = lodash.extend({}, current, {FunctionName: LAMBDA_FUNCTION})

    fs.readFile(`build/reactifier.${pkg.version}.zip`, (readError, zipFile) => {
      config.ZipFile = zipFile

      lambda.updateFunctionCode(config, error => {
        if (error) {
          gutil.log('Package upload failed. Check your iam:PassRole permissions.')
        }
      })

      done()
    })
  })
})
