function init_toc_for_preview(cm) {


    /**
     * Slugger generates header id
     */
    let Slugger_1 = /*#__PURE__*/function () {
        function Slugger() {
            this.seen = {};
        }

        let _proto = Slugger.prototype;

        _proto.serialize = function serialize(value) {
            return value.toLowerCase().trim() // remove html tags
                .replace(/<[!\/a-z].*?>/ig, '') // remove unwanted chars
                .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '').replace(/\s/g, '-');
        }
            /**
             * Finds the next safe (unique) slug to use
             */
            ;

        _proto.getNextSafeSlug = function getNextSafeSlug(originalSlug, isDryRun) {
            let slug = originalSlug;
            let occurenceAccumulator = 0;

            if (this.seen.hasOwnProperty(slug)) {
                occurenceAccumulator = this.seen[originalSlug];

                do {
                    occurenceAccumulator++;
                    slug = originalSlug + '-' + occurenceAccumulator;
                } while (this.seen.hasOwnProperty(slug));
            }

            if (!isDryRun) {
                this.seen[originalSlug] = occurenceAccumulator;
                this.seen[slug] = 0;
            }

            return slug;
        }
            /**
             * Convert string to unique id
             * @param {object} options
             * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
             */
            ;

        _proto.slug = function slug(value, options) {
            if (options === void 0) {
                options = {};
            }

            let slug = this.serialize(value);
            return this.getNextSafeSlug(slug, options.dryrun);
        };

        return Slugger;
    }();

    let slugger_for_toc = new Slugger_1();








    let $toc = document.getElementById('toc')
    let lastTOC = ""

    //let update = function ()
    let newTOC = ""
    cm.eachLine(function (line) {
        let tmp = /^(#+)\s+(.+)(?:\s+\1)?$/.exec(line.text);
        if (!tmp) return
        //let lineNo = line.lineNo();
        //if (!cm.getStateAfter(lineNo).header) return // double check but is not header
        let level = tmp[1].length

        let title = tmp[2]
        title = title.replace(/([*_]{1,2}|~~|`+)(.+?)\1/g, '$2') // em / bold / del / code
        title = title.replace(/\\(?=.)|\[\^.+?\]|\!\[((?:[^\\\]]+|\\.)+)\](\(.+?\)| ?\[.+?\])?/g, '') // images / escaping slashes / footref
        title = title.replace(/\[((?:[^\\\]]+|\\.)+)\](\(.+?\)| ?\[.+?\])/g, '$1') // links
        title = title.replace(/&/g, '&amp;')
        title = title.replace(/</g, '&lt;')

        let title_id = slugger_for_toc.slug(title);
        newTOC += '<a href="#' + title_id + '" class="toc-item" style="padding-left:' + level + 'em">' + title + '</a>'
    })
    if (newTOC == lastTOC) return
    $toc.innerHTML = lastTOC = newTOC
    //


}

