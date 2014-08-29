const Lang = imports.lang;
const Params = imports.params;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Pango = imports.gi.Pango;
const Gc = imports.gi.Gc;
const Util = imports.util;

const CharacterDialog = new Lang.Class({
    Name: 'CharacterDialog',
    Extends: Gtk.Dialog,

    _init: function(params) {
        let filtered = Params.filter(params, { character: null });
        params = Params.fill(params, { use_header_bar: true });
        this.parent(params);

        let builder = new Gtk.Builder();
        builder.add_from_resource('/org/gnome/Characters/character.ui');
        let grid = builder.get_object('main-grid');
        this.get_content_area().add(grid);

        this._character = filtered.character;
        this.characterLabel = builder.get_object('character-label');
        this.characterLabel.label = this._character;

        let detailLabel = builder.get_object('detail-label');
        let codePoint = filtered.character.charCodeAt(0);
        let codePointHex = codePoint.toString(16).toUpperCase();
        detailLabel.label = _("Unicode U+%04s").format(codePointHex);

        let copyBtn = builder.get_object('copy-button');
        copyBtn.connect('clicked', Lang.bind(this, this._copyCharacter));

        let name = Gc.character_name(filtered.character);
        if (name != null) {
            let headerBar = this.get_header_bar();
            headerBar.title = Util.capitalize(name);
        }

        this.add_button(_("See also"), Gtk.ResponseType.HELP);
        let doneBtn = this.add_button(_("Done"), Gtk.ResponseType.CLOSE);
        doneBtn.get_style_context().add_class(Gtk.STYLE_CLASS_SUGGESTED_ACTION);
    },

    _copyCharacter: function() {
        let clipboard = Gc.gtk_clipboard_get();
        // FIXME: GLib.unichar_to_utf8() has missing (nullable)
        // annotation to the outbuf argument.
        let outbuf = '      ';
        let length = GLib.unichar_to_utf8(this._character, outbuf);
        clipboard.set_text(this._character, length);
    }
});
