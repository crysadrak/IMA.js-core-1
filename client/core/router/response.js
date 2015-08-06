import ns from 'imajs/client/core/namespace.js';
import IMAError from 'imajs/client/core/imaError.js';

ns.namespace('Core.Router');

/**
 * Wrapper for the ExpressJS response, exposing only the neccessary minimum.
 *
 * @class Response
 * @namespace Core.Router
 * @module Core
 * @submodule Core.Router
 */
export default class Response {

	/**
	 * Initializes the response.
	 *
	 * @constructor
	 * @method constructor
	 */
	constructor() {

		/**
		 * The ExpressJS response object, or {@code null} if running at the client
		 * side.
		 *
		 * @private
		 * @property _response
		 * @type {?Express.Response}
		 * @default null
		 */
		this._response = null;

		/**
		 * It is flag for sent response for request.
		 *
		 * @private
		 * @property _isSent
		 * @type {boolean}
		 * @default false
		 */
		this._isSent = false;

		/**
		 * HTTP Status code.
		 *
		 * @property _status
		 * @type {number}
		 * @default 500
		 */
		this._status = 500;

		/**
		 * The content of response.
		 *
		 * @property _content
		 * @type {string}
		 * @default ''
		 */
		this._content = '';
	}

	/**
	 * Initializes this response wrapper with the provided ExpressJS response
	 * object.
	 *
	 * @method init
	 * @chainable
	 * @param {?Express.Response} response The ExpressJS response, or
	 *        {@code null} if the code is running at the client side.
	 * @return {Core.Router.Response} This response.
	 */
	init(response) {
		this._response = response;
		this._isSent = false;
		this._status = 500;
		this._content = '';
		return this;
	}

	/**
	 * Redirects the client to the specified location, with the specified
	 * redirect HTTP response code.
	 *
	 * For full list of HTTP response status codes see
	 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	 *
	 * Use this method only at the server side.
	 *
	 * @chainable
	 * @method redirect
	 * @param {string} url The URL to which the client should be redirected.
	 * @param {number=} [status=303] The HTTP status code to send to the client.
	 * @return {Core.Router.Response} This response.
	 */
	redirect(url, status = 303) {
		if (this._isSent === true && $Debug) {
			var params = this.getResponseParams();
			params.url = url;

			throw new IMAError('Core.Router.Response:redirect The response has already ' +
					'been sent. Check your workflow.', params);
		}

		this._isSent = true;
		this._status = status;
		this._response.redirect(status, url);

		return this;
	}

	/**
	 * Sets the HTTP status code that will be sent to the client when the
	 * response is sent.
	 *
	 * For full list of available response codes see
	 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
	 *
	 * Use this method only at the server side.
	 *
	 * @chainable
	 * @method status
	 * @param {number} httpStatus HTTP response status code to send to the
	 *        client.
	 * @return {Core.Router.Response} This response.
	 */
	status(httpStatus) {
		if (this._isSent === true && $Debug) {
			var params = this.getResponseParams();

			throw new IMAError('Core.Router.Response:status The response has already ' +
					'been sent. Check your workflow.', params);
		}

		this._status = httpStatus;
		this._response.status(httpStatus);

		return this;
	}

	/**
	 * Sends the response to the client with the provided content. Use this
	 * method only at the server side.
	 *
	 * @chainable
	 * @method send
	 * @param {string} content The response body.
	 * @return {Core.Router.Response} This response.
	 */
	send(content) {
		if (this._isSent === true && $Debug) {
			var params = this.getResponseParams();
			params.content = content;

			throw new IMAError('Core.Router.Response:send The response has already ' +
					'been sent. Check your workflow.', params);
		}

		this._isSent = true;
		this._content = content;
		this._response.send(content);

		return this;
	}

	/**
	 * Sets a cookie, which will be sent to the client with the response.
	 *
	 * @chainable
	 * @method setCookie
	 * @param {string} name The cookie name.
	 * @param {(boolean|number|string)} value The cookie value, will be converted
	 *        to string.
	 * @param {{domain: string=, expires: (number|string)=}} options Cookie
	 *        attributes. Only the attributes listed in the type annotation of
	 *        this field are supported. For documentation and full list of cookie
	 *        attributes see http://tools.ietf.org/html/rfc2965#page-5
	 * @return {Core.Router.Response} This response.
	 */
	setCookie(name, value, options = {}) {
		if (this._isSent === true && $Debug) {
			var params = this.getResponseParams();
			params.name = name;
			params.value = value;
			params.options = options;

			throw new IMAError('Core.Router.Response:setCookie The response has already ' +
					'been sent. Check your workflow.', params);
		}

		this._response.cookie(name, value, options);

		return this;
	}

	/**
	 * Return object which contains response status and content.
	 *
	 * @method getResponseParams
	 * @return {{status: number, content: string}}
	 */
	getResponseParams() {
		return { status: this._status, content: this._content };
	}

	/**
	 * Return true if response is sent from server to client.
	 *
	 * @method isResponseSent
	 * @return {boolean}
	 */
	isResponseSent() {
		return this._isSent;
	}
}

ns.Core.Router.Response = Response;
