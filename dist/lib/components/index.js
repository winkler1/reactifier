'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _article = require('./article');

var _article2 = _interopRequireDefault(_article);

var _footer = require('./footer');

var _footer2 = _interopRequireDefault(_footer);

var _head = require('./head');

var _head2 = _interopRequireDefault(_head);

var Index = (function (_Component) {
  _inherits(Index, _Component);

  function Index() {
    _classCallCheck(this, Index);

    _Component.apply(this, arguments);
  }

  Index.prototype.render = function render() {

    return _react2['default'].createElement(
      'html',
      null,
      _react2['default'].createElement(_head2['default'], null),
      _react2['default'].createElement(
        'body',
        null,
        _react2['default'].createElement(
          'header',
          { className: 'title' },
          'Reactifier',
          _react2['default'].createElement(
            'strong',
            null,
            '.'
          )
        ),
        _react2['default'].createElement(
          'section',
          { id: 'description' },
          _react2['default'].createElement(
            'p',
            null,
            'A blog post aggregator bringing together React developers from across the globe. Use the ',
            _react2['default'].createElement(
              'a',
              { href: 'http://reactifier.com/rss.xml' },
              'RSS Feed'
            ),
            ' to subscribe in your favorite feed reader. Would you like to see your blog on this site? Send a pull request for ',
            _react2['default'].createElement(
              'a',
              { href: 'https://github.com/bkonkle/reactifier/blob/master/subscriptions.json' },
              'this file'
            ),
            '!'
          )
        ),
        _react2['default'].createElement(
          'main',
          { id: 'posts' },
          this.props.posts.map(function (post) {
            return _react2['default'].createElement(_article2['default'], _extends({ key: post.attributes.guid }, post));
          })
        ),
        _react2['default'].createElement(_footer2['default'], null)
      )
    );
  };

  _createClass(Index, null, [{
    key: 'displayName',
    value: 'Index',
    enumerable: true
  }, {
    key: 'propTypes',
    value: {
      posts: _react.PropTypes.array.isRequired
    },
    enumerable: true
  }]);

  return Index;
})(_react.Component);

exports['default'] = Index;
module.exports = exports['default'];