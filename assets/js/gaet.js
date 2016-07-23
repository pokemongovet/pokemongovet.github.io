/**!
 * Google Analytics Event Tracking - Alligo Helper
 * @author Emerson Rocha Luiz <emerson at alligo.com.br
 * @see https://github.com/alligo/google-analytics-event-tracking
 */

/* global: google */

if (window.GAET) {
  console.log('WARNING! GAET loaded more than once');
}

(function ($, window) {
  window.GAET = window.GAET || {};
  GAET.debug = window.GAETDebug || false;
  GAET.maxwait  = window.GAETMaxwait || 1000;
  GAET.version = 'v0.5.1';

  /**
   * Prepara para enviar eventos ao Google Analytics
   *
   * @example
   * <form
   *      data-ga-event="click"
   *      data-ga-category="Evento/Comartilhar"
   *      data-ga-action="Compartilhou/WhatsApp"
   *      data-ga-label="Evento_7_lorem-ipsum"
   * ></form>
   */
  GAET.prepareEvents = function () {
    var els = $('[data-ga-event]');

    $.each(els, function (index, value) {
      var el = $(this),
        evEvent = $(this).data('ga-event'),
        evCat = $(this).data('ga-category') || '',
        evAct = $(this).data('ga-action') || '',
        evLab = $(this).data('ga-label') || '',
        evVal = $(this).data('ga-value') || undefined,
        evAdded = $(this).data('ga-gaet') || false;

      if (evAdded) {
        // Do not add 2 times event for the same element
        // Mark this element as already processed by GAET
        GAET.debug && console.log('window.GAET.prepareEvents skipping', el, evAdded);
        return true;
      }

      GAET.debug && console.log('window.GAET.prepareEvents prepared', evEvent, evCat, evAct, evLab, evVal, el);
      el.data('ga-gaet', 1);

      // Check if os a event that run immediately
      if (evEvent === 'load' || evEvent === 'ready') {
        try {
          GAET.debug && console.log('window.GAET.prepareEvents FIRED!', evEvent, evCat, evAct, evLab, evVal, el);
          ga('send', 'event', evCat, evAct, evLab, evVal);
        } catch (e) {
          console.log('GAET.prepareEvents Exception', e);
        }
      } else {

        // Is a normal DOM event. Run it
        $(this).on(evEvent, function (elEvent) {
          //GAET.debug && console.log('window.GAET.prepareEvents', evEvent, evCat, evAct, evLab, evVal);
          GAET.debug && console.log('window.GAET.prepareEvents FIRED!', evEvent, evCat, evAct, evLab, evVal, el);
          if (evEvent === 'click' || evEvent === 'submit') {
            if (!el.data('ga-done')) {
              GAET.prepareEventWait(el, elEvent, evEvent, evCat, evAct, evLab, evVal);
            }
          } else {
            try {
              ga('send', 'event', evCat, evAct, evLab, evVal);
            } catch (e) {
              console.log('GAET.prepareEvents Exception', e);
            }
          }
        });
      }
    });

  };

  /**
   * Alguns eventos, como clique em URL e submissão em formulário, não seriam
   * enviados se não interromper a ação. Essa rotina atrasa o evento padrão
   * para aguardar retorno do Google Analycs, e em 1000ms executa a ação mesmo
   * que o servidores do Google tenham erro.
   *
   * @see GAET.prepareEvents()
   *
   * @param {DOMElement} el
   * @param {Event}      elEvent
   * @param {String}     evEvent
   * @param {String}     evCat
   * @param {String}     evAct
   * @param {String}     evLab
   * @param {String}     [evVal]
   * @returns {GAET.prepareEventWait}
   */
  GAET.prepareEventWait = function (el, elEvent, evEvent, evCat, evAct, evLab, evVal) {
    var fnDestinoDone = false, fnDestino;

    elEvent.preventDefault();

    fnDestino = function () {
      //clearTimeout(t);
      if (fnDestinoDone || $(elEvent).data('ga-done')) {
        return true;
      } else {
        $(el).data('ga-done', 1);
        fnDestinoDone = true;
      }
      if (evEvent === 'click') {
        if (elEvent.target.getAttribute("target") === '_blank') {
          elEvent.target.click();
          return true;
        } else {
          document.location = $(el).prop('href');
        }

      } else if (evEvent === 'submit') {
        $(el)[0].submit();
      } else {
        console.log('GAET.prepareEventWait: evento desconhecido', el, evEvent);
      }
    };

    // If for some reason GA take too much time, abort and continue
    setTimeout(fnDestino, GAET.maxwait);

    try {
      ga('send', {
        hitType: 'event',
        eventCategory: evCat,
        eventAction: evAct,
        eventLabel: evLab,
        eventValue: evVal || undefined
      }, {
          hitCallback: fnDestino
        });
    } catch (e) {
      console.log('GAET.prepareEventWait Exception', e);
    }
  };

  /**
   * Init all
   */
  GAET.initAll = function () {
    $(document).ready(function () {
      //if (!!ga) {
      if (typeof ga != 'undefined') {
        GAET.debug && console.log('GAET.initAll');
        GAET.prepareEvents();
      } else {
        console.log('GAET: Google analytics.js (ga) not loaded. Aborting');
      }
      //if (!!_gaq) {
      if (typeof _gaq != 'undefined') {
        console.log('GAET: Old Google analytics (_gaq) loaded. Please use only new ga');
      }
    });
  };
  //...
})(jQuery, window);

GAET.initAll();