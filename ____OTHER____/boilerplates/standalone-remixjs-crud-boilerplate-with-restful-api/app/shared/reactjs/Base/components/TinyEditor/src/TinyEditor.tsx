import { Editor, IAllProps } from '@tinymce/tinymce-react';
import classNames from 'classnames';
import { isEmpty } from 'ramda';
import { FC, useEffect, useState } from 'react';
import { useDebouncedValue, useDeepCompareMemo, useIsMounted } from '../../../hooks';
import './styles.css';
import { MenuBar } from './types/MenuBar';
import { Plugin } from './types/Plugin';
import { Toolbar } from './types/Toolbar';

export interface Props {
  /** An array of plugins to be used in the TinyEditor. */
  plugins?: Plugin[];
  /** A 2D array of toolbar configurations. */
  toolbars?: Toolbar[][];
  /** A 2D array of toolbar configurations for quick selection. */
  quickSelectionToolbars?: Toolbar[][];
  /** An array of menu bar configurations. */
  menubar?: MenuBar[];
  /** Configuration for a sticky toolbar. */
  toolbarSticky?: Toolbar;
  /** Offset value for the sticky toolbar. */
  toolbarStickyOffset?: number;
  /** Whether the editor is disabled. */
  disabled?: boolean;
  /** Whether the editor is read-only. */
  readOnly?: boolean;
  /** API key for authentication. */
  apiKey: string;
  /** Initial value of the editor content. */
  value?: string;
  /** Callback function to handle change events. */
  onChange?: (value: string | undefined) => void;
  /** Callback function to handle debounced change events. */
  onDebounceChange?: (value: string | undefined) => void;
  /** Additional CSS class names for the editor. */
  className?: string;
  /** Height of the editor. */
  height?: string | number;
  /** Width of the editor. */
  width?: string | number;
  /** Minimum height of the editor. */
  minHeight?: number;
  /** Minimum width of the editor. */
  minWidth?: number;
  /** Maximum height of the editor. */
  maxHeight?: number;
  /** Maximum width of the editor. */
  maxWidth?: number;
  /** Handler for image uploads. */
  imagesUploadHandler?: Required<IAllProps>['init']['images_upload_handler'];
  /** Placeholder text for the input. */
  placeholder?: string;
  /** Determines if the input is controlled or uncontrolled state. */
  valueVariant?: 'controlled-state' | 'uncontrolled-state';
}

/**
 * TinyEditor component.
 *
 * This component provides a rich text editor with customizable plugins, toolbars, and other properties.
 *
 * @param {Props} props - The properties for configuring the TinyEditor component.
 * @param {Plugin[]} [props.plugins=[]] - An array of plugins to enhance the TinyEditor functionality.
 * @param {Toolbar[][]} [props.toolbars=[]] - A 2D array representing the configuration of toolbars.
 * @param {Toolbar[][]} [props.quickSelectionToolbars=[]] - A 2D array for configuring quick selection toolbars.
 * @param {MenuBar[]} [props.menubar=[]] - An array defining the items in the menu bar.
 * @param {Toolbar} [props.toolbarSticky] - Configuration object for making a toolbar sticky.
 * @param {number} [props.toolbarStickyOffset] - Offset value for the sticky toolbar, in pixels.
 * @param {boolean} [props.disabled=false] - Whether the editor is disabled, preventing user interactions.
 * @param {boolean} [props.readOnly=false] - Whether the editor is read-only, allowing content to be viewed but not edited.
 * @param {string} props.apiKey - API key for authenticating with the TinyEditor service.
 * @param {string} [props.value] - The initial content value of the editor.
 * @param {(value: string | undefined) => void} [props.onChange] - Callback function called when the content of the editor changes.
 * @param {(value: string | undefined) => void} [props.onDebounceChange] - Callback function called with debounced changes to the editor content.
 * @param {string} [props.className] - Additional CSS class names to apply to the editor component.
 * @param {string | number} [props.height] - The height of the editor.
 * @param {string | number} [props.width] - The width of the editor.
 * @param {number} [props.minHeight] - The minimum height of the editor, in pixels.
 * @param {number} [props.minWidth] - The minimum width of the editor, in pixels.
 * @param {number} [props.maxHeight] - The maximum height of the editor, in pixels.
 * @param {number} [props.maxWidth] - The maximum width of the editor, in pixels.
 * @param {string} [props.placeholder] - Placeholder text for the input.
 * @param {'controlled-state' | 'uncontrolled-state'} [props.valueVariant] - Determines if the input is controlled or uncontrolled state.
 * @param {Required<IAllProps>['init']['images_upload_handler]} [props.imagesUploadHandler] - Handler function for managing image uploads within the editor.
 * @returns {JSX.Element} The rendered TinyEditor component.
 */
export const TinyEditor: FC<Props> = ({
  plugins = [],
  toolbars = [],
  quickSelectionToolbars = [],
  menubar = [],
  toolbarSticky,
  toolbarStickyOffset,
  disabled = false,
  readOnly = false,
  apiKey,
  onChange,
  onDebounceChange,
  value = '',
  className,
  height,
  width,
  minHeight,
  minWidth,
  maxHeight,
  maxWidth,
  placeholder,
  imagesUploadHandler,
  valueVariant = 'uncontrolled-state',
}) => {
  const isMounted = useIsMounted();
  const [valueState, setValueState] = useState(value);
  const { value: valueStateDebounced, clearTimeout } = useDebouncedValue(valueState, { timeoutMs: 300 });

  const handleChange: IAllProps['onEditorChange'] = (_, editor) => {
    const value = editor.getContent();
    const isUndefined = isEmpty(value) || null;
    const value_ = isUndefined ? undefined : value;
    setValueState(value_ ?? '');
    onChange?.(value_);
  };

  const handleBlur: IAllProps['onBlur'] = (_, editor) => {
    const value = editor.getContent();
    const isUndefined = isEmpty(value) || null;
    const value_ = isUndefined ? undefined : value;
    clearTimeout();
    setValueState(value_ ?? '');
    onDebounceChange?.(value_);
  };

  useEffect(() => {
    setValueState(value);
  }, [value]);

  useEffect(() => {
    if (isMounted) {
      onDebounceChange?.(valueStateDebounced);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueStateDebounced]);

  const mergedValueState = useDeepCompareMemo(() => {
    if (!isMounted) {
      return undefined;
    }
    return valueVariant === 'controlled-state' ? value : valueState;
  }, [value, valueState, isMounted, valueVariant]);

  return (
    <div className={classNames('TinyEditor__container', className)}>
      <Editor
        value={mergedValueState}
        onEditorChange={handleChange}
        onBlur={handleBlur}
        disabled={disabled || readOnly}
        apiKey={apiKey}
        init={{
          width,
          height,
          min_height: minHeight,
          min_width: minWidth,
          max_height: maxHeight,
          max_width: maxWidth,
          menubar: readOnly ? false : isEmpty(menubar) ? false : menubar?.join(' '),
          toolbar: readOnly ? false : toolbars.map(toolbar => toolbar.join(' ')).join('|'),
          quickbars_selection_toolbar: readOnly
            ? false
            : quickSelectionToolbars.map(toolbar => toolbar.join(' ')).join('|'),
          toolbar_mode: 'sliding',
          plugins: readOnly ? [] : plugins,
          toolbar_sticky: !!toolbarSticky,
          toolbar_location: toolbarSticky as any,
          toolbar_sticky_offset: toolbarStickyOffset,
          placeholder: placeholder,

          // TODO: Incoming
          // Thêm id vào thẻ body trong iframe của TinyMCE
          body_id: undefined,
          // Thêm class vào thẻ body trong iframe của TinyMCE
          body_class: undefined,
          // RTL
          directionality: undefined,
          // Cái này để custom syntax ==> Có thể biến nó thành kiểu viết markdown file
          text_patterns: undefined,
          // Đi theo "text_patterns" để customize thêm
          text_patterns_lookup: undefined,
          // Giới hạn stacks trong history (Undo redo) ==> Mặc định là vô hạn
          custom_undo_redo_levels: undefined,
          // Color scheme cho các tool pick màu
          color_map: undefined,
          // Load file css vào iframe của TinyMCE
          content_css: undefined,
          // Setup cors nhưng không cần thiết
          content_css_cors: undefined,
          // Setup cors nhưng không cần thiết
          content_security_policy: undefined,
          // Load content thẻ style vào iframe của TinyMCE
          content_style: undefined,
          // Liên quan đến action click chuột phải vào content
          contextmenu: undefined,
          // Liên quan đến action click chuột phải vào iframe của TinyMCE
          contextmenu_never_use_native: undefined,
          end_container_on_empty_block: undefined,
          entities: undefined,
          entity_encoding: undefined,
          file_picker_types: undefined,
          fix_list_elements: undefined,
          font_css: undefined,
          font_family_formats: undefined,
          font_size_formats: undefined,
          font_size_input_default_unit: undefined,
          forced_root_block: undefined,
          forced_root_block_attrs: undefined,
          formats: undefined,
          style_formats: undefined,
          style_formats_autohide: undefined,
          style_formats_merge: undefined,
          valid_children: undefined,
          valid_classes: undefined,
          valid_elements: undefined,
          valid_styles: undefined,
          statusbar: undefined,
          smart_paste: undefined,
          resize: undefined,
          resize_img_proportional: undefined,
          removed_menuitems: undefined,
          remove_trailing_brs: undefined,
          paste_as_text: undefined,
          paste_block_drop: undefined,
          paste_data_images: undefined,
          paste_merge_formats: undefined,
          paste_postprocess: undefined,
          paste_preprocess: undefined,
          paste_webkit_styles: undefined,
          paste_tab_spaces: undefined,
          paste_remove_styles_if_webkit: undefined,
          noneditable_regexp: undefined,
          noneditable_class: undefined,
          line_height_formats: undefined,
          language: undefined,
          language_load: undefined,
          language_url: undefined,
          icons: undefined,
          icons_url: undefined,
          id: undefined,

          images_upload_handler: async (blobInfo, progress) => {
            if (imagesUploadHandler) {
              return imagesUploadHandler(blobInfo, progress);
            }
            return Promise.resolve(URL.createObjectURL(blobInfo.blob()));
          },
          // Sử dụng "images_upload_handler"
          images_file_types: undefined,
          // Sử dụng "images_upload_handler"
          images_replace_blob_uris: undefined,
          // Sử dụng "images_upload_handler"
          images_reuse_filename: undefined,
          // Sử dụng "images_upload_handler"
          images_upload_base_path: undefined,
          // Sử dụng "images_upload_handler"
          images_upload_credentials: undefined,
          // Sử dụng "images_upload_handler"
          images_upload_url: undefined,

          // Chưa quan tâm vì chưa quá quan trọng
          indent: undefined,
          // Chưa quan tâm vì chưa quá quan trọng
          indent_use_margin: undefined,
          // Chưa quan tâm vì chưa quá quan trọng
          indentation: undefined,
          // Chưa quan tâm vì chưa quá quan trọng
          iframe_aria_text: undefined,
          // Chưa quan tâm vì chưa quá quan trọng
          highlight_on_focus: undefined,
          // Chưa quan tâm vì chưa quá quan trọng
          hidden_input: undefined,
          // Chưa quan tâm vì chưa quá quan trọng
          help_accessibility: false,
          // Không cần thiết vì chưa chắc dùng key xịn + Có thể ẩn bằng css
          branding: undefined,
          // Để cho spellchecker của browser nhưng không cần thiết
          content_langs: undefined,
          // Không nên setup mặc định là "true" và như thế này mới đúng ==> css fontFamily được add vào thẻ style
          convert_fonts_to_spans: undefined,
          // Không nên setup mặc định là "true" và như thế này mới đúng ==> Các thẻ video, object, ...
          convert_unsafe_embeds: undefined,
          // Không nên setup mặc định là "true" và như thế này mới đúng ==> Convert thành absolute path
          convert_urls: undefined,
          // Không nên setup mặc định là "false" và như thế sẽ tốt hơn ==> Enable color schema trong các color picker
          custom_colors: undefined,
          // Cho phép kéo thả các dialog như upload ảnh, chọn symbol, ... ==> Tắt đi cho đỡ phiền
          draggable_modal: undefined,

          // Không dùng trong bản react
          editable_class: undefined,
          // Không dùng trong bản react
          editable_root: undefined,
          // Không dùng trong bản react
          selector: undefined,
          // Không dùng trong bản react
          init_instance_callback: undefined,
          // Không dùng trong bản react
          readOnly: undefined,

          // Không quan tâm vì khá sida
          ui_mode: undefined,

          // "toolbar" là đủ
          toolbar1: undefined,
          // "toolbar" là đủ
          toolbar2: undefined,
          // "toolbar" là đủ
          toolbar3: undefined,
          // "toolbar" là đủ
          toolbar4: undefined,
          // "toolbar" là đủ
          toolbar5: undefined,
          // "toolbar" là đủ
          toolbar6: undefined,
          // "toolbar" là đủ
          toolbar7: undefined,
          // "toolbar" là đủ
          toolbar8: undefined,
          // "toolbar" là đủ
          toolbar9: undefined,
          // "toolbar" là đủ
          toolbar_groups: undefined,

          // Khó để custom và cũng không cần thiết
          skin: undefined,
          // Khó để custom và cũng không cần thiết
          skin_url: undefined,

          // Không dùng vì kiểu này dùng medium editor sẽ ngon hơn
          inline: undefined,
          // Không quan tâm vì phải bật "inline"
          fixed_toolbar_container: undefined,
          // Không quan tâm vì phải bật "inline"
          fixed_toolbar_container_target: undefined,

          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          a11y_advanced_options: undefined,
          // Không có trong docs
          add_form_submit_trigger: undefined,
          // Không có trong docs
          add_unload_trigger: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          allow_conditional_comments: undefined,
          // Không có trong docs
          allow_html_data_urls: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          allow_html_in_named_anchor: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          allow_script_urls: undefined,
          // Không có trong docs
          allow_svg_data_urls: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          allow_unsafe_link_target: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          anchor_bottom: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          anchor_top: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          auto_focus: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          automatic_uploads: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          base_url: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          block_formats: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          block_unsupported_drop: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          br_in_pre: undefined,
          // Không có trong docs
          br_newline_selector: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          browser_spellcheck: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          cache_suffix: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          color_cols: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          color_cols_foreground: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          color_cols_background: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          color_map_foreground: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          color_map_background: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          color_default_foreground: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          color_default_background: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          custom_elements: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          custom_ui_selector: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          default_font_stack: undefined,
          // Không có trong docs
          deprecation_warnings: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          doctype: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          document_base_url: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          element_format: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          elementpath: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          encoding: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          extended_valid_elements: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          event_root: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          file_picker_callback: undefined,
          // Không có trong docs
          file_picker_validator_handler: undefined,
          // Không có trong docs
          font_size_classes: undefined,
          // Không có trong docs
          font_size_legacy_values: undefined,
          // Không có trong docs
          font_size_style_values: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          format_noneditable_selector: undefined,
          // Không có trong docs
          iframe_attrs: undefined,
          // Không có trong docs
          indent_after: undefined,
          // Không có trong docs
          indent_before: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          inline_boundaries: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          inline_boundaries_selector: undefined,
          // Không có trong docs
          inline_styles: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          invalid_elements: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          invalid_styles: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          keep_styles: undefined,
          // Không có trong docs
          menu: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          model: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          model_url: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          newdocument_content: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          newline_behavior: undefined,
          // Không có trong docs
          no_newline_selector: undefined,
          // Không có trong docs
          nowrap: undefined,
          object_resizing: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          pad_empty_with_br: undefined,
          // Không có trong docs
          preserve_cdata: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          preview_styles: undefined,
          // Không có trong docs
          promotion: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          protect: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          referrer_policy: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          relative_urls: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          remove_script_host: undefined,
          // Không có trong docs
          root_name: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          sandbox_iframes: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          sandbox_iframes_exclusions: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          schema: undefined,
          // Không có trong docs
          setup: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          sidebar_show: undefined,
          // Không có trong docs
          submit_patch: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          suffix: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          table_tab_navigation: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          target: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          theme: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          theme_url: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          typeahead_urls: undefined,
          // Không có trong docs
          url_converter: undefined,
          // Không có trong docs
          url_converter_scope: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          urlconverter_callback: undefined,
          // Không có trong docs
          verify_html: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          visual: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          visual_anchor_class: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          visual_table_class: undefined,
          // Chưa hiểu lắm nhưng có vẻ không cần thiết
          xss_sanitization: undefined,
          // Không có trong docs
          disable_nodechange: undefined,
          // Không có trong docs
          forced_plugins: undefined,
          // Không có trong docs
          plugin_base_urls: undefined,
          // Không có trong docs
          service_message: undefined,

          // Không dùng trong react tiny editor
          license_key: undefined,
        }}
      />
    </div>
  );
};
