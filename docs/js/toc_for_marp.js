function init_toc_for_marp() {


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


    //スラッガーのインスタンスを生成
    let slugger_for_toc = new Slugger_1();

    //preview画面要素を取得
    let wrapper = easyMDE.codemirror.getWrapperElement();
    let preview = wrapper.lastChild;

    //h1~6を全て取得
    let marp_h1 = preview.getElementsByTagName("h1");
    let marp_h2 = preview.getElementsByTagName("h2");
    let marp_h3 = preview.getElementsByTagName("h3");
    let marp_h4 = preview.getElementsByTagName("h4");
    let marp_h5 = preview.getElementsByTagName("h5");
    let marp_h6 = preview.getElementsByTagName("h6");

    //配列メソッドのforEachを使えるように、h1~h6のhtmlcollectionを配列として保管
    let marp_h_all = [marp_h1, marp_h2, marp_h3, marp_h4, marp_h5, marp_h6];


    //h1~h6それぞれのhtmlcollectionで実行
    marp_h_all.forEach(function (marp_h) {

        //idをスラッガーで生成し、id属性として各hへ設定
        Array.prototype.forEach.call(marp_h, function (element) {

            let h_id = slugger_for_toc.slug(element.innerText);
            element.setAttribute("id", h_id);

        });

    });





}

