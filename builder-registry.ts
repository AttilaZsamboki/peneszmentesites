"use client";
import { Builder } from "@builder.io/react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import AutoComplete from "./app/_components/AutoComplete";
import { Badge } from "./components/ui/badge";
import Counter from "./components/Counter/Counter";

Builder.registerComponent(Counter, {
  name: "Counter",
  inputs: [
    {
      name: "initialCount",
      type: "number",
    },
  ],
});

Builder.registerComponent(AccordionContent, {
  name: "AccordionContent",
  inputs: [
    {
      name: "key",
      type: "string",
    },
    {
      name: "ref",
      type: "string",
    },
  ],
});

Builder.registerComponent(AccordionItem, {
  name: "AccordionItem",
  inputs: [
    {
      name: "disabled",
      type: "boolean",
    },
    {
      name: "key",
      type: "string",
    },
    {
      name: "ref",
      type: "string",
    },
    {
      name: "value",
      type: "string",
      required: true,
    },
  ],
});

Builder.registerComponent(AccordionTrigger, {
  name: "AccordionTrigger",
  inputs: [
    {
      name: "key",
      type: "string",
    },
    {
      name: "ref",
      type: "string",
    },
  ],
});

Builder.registerComponent(Alert, {
  name: "Alert",
  inputs: [
    {
      name: "about",
      type: "string",
    },
    {
      name: "accessKey",
      type: "string",
    },
    {
      name: "aria-activedescendant",
      type: "string",
    },
    {
      name: "aria-atomic",
      type: "string",
    },
    {
      name: "aria-autocomplete",
      type: "string",
    },
    {
      name: "aria-braillelabel",
      type: "string",
    },
    {
      name: "aria-brailleroledescription",
      type: "string",
    },
    {
      name: "aria-busy",
      type: "string",
    },
    {
      name: "aria-checked",
      type: "string",
    },
    {
      name: "aria-colcount",
      type: "number",
    },
    {
      name: "aria-colindex",
      type: "number",
    },
    {
      name: "aria-colindextext",
      type: "string",
    },
    {
      name: "aria-colspan",
      type: "number",
    },
    {
      name: "aria-controls",
      type: "string",
    },
    {
      name: "aria-current",
      type: "string",
    },
    {
      name: "aria-describedby",
      type: "string",
    },
    {
      name: "aria-description",
      type: "string",
    },
    {
      name: "aria-details",
      type: "string",
    },
    {
      name: "aria-disabled",
      type: "string",
    },
    {
      name: "aria-dropeffect",
      type: "string",
    },
    {
      name: "aria-errormessage",
      type: "string",
    },
    {
      name: "aria-expanded",
      type: "string",
    },
    {
      name: "aria-flowto",
      type: "string",
    },
    {
      name: "aria-grabbed",
      type: "string",
    },
    {
      name: "aria-haspopup",
      type: "string",
    },
    {
      name: "aria-hidden",
      type: "string",
    },
    {
      name: "aria-invalid",
      type: "string",
    },
    {
      name: "aria-keyshortcuts",
      type: "string",
    },
    {
      name: "aria-label",
      type: "string",
    },
    {
      name: "aria-labelledby",
      type: "string",
    },
    {
      name: "aria-level",
      type: "number",
    },
    {
      name: "aria-live",
      type: "string",
    },
    {
      name: "aria-modal",
      type: "string",
    },
    {
      name: "aria-multiline",
      type: "string",
    },
    {
      name: "aria-multiselectable",
      type: "string",
    },
    {
      name: "aria-orientation",
      type: "string",
    },
    {
      name: "aria-owns",
      type: "string",
    },
    {
      name: "aria-placeholder",
      type: "string",
    },
    {
      name: "aria-posinset",
      type: "number",
    },
    {
      name: "aria-pressed",
      type: "string",
    },
    {
      name: "aria-readonly",
      type: "string",
    },
    {
      name: "aria-relevant",
      type: "string",
    },
    {
      name: "aria-required",
      type: "string",
    },
    {
      name: "aria-roledescription",
      type: "string",
    },
    {
      name: "aria-rowcount",
      type: "number",
    },
    {
      name: "aria-rowindex",
      type: "number",
    },
    {
      name: "aria-rowindextext",
      type: "string",
    },
    {
      name: "aria-rowspan",
      type: "number",
    },
    {
      name: "aria-selected",
      type: "string",
    },
    {
      name: "aria-setsize",
      type: "number",
    },
    {
      name: "aria-sort",
      type: "string",
    },
    {
      name: "aria-valuemax",
      type: "number",
    },
    {
      name: "aria-valuemin",
      type: "number",
    },
    {
      name: "aria-valuenow",
      type: "number",
    },
    {
      name: "aria-valuetext",
      type: "string",
    },
    {
      name: "autoCapitalize",
      type: "string",
    },
    {
      name: "autoCorrect",
      type: "string",
    },
    {
      name: "autoFocus",
      type: "boolean",
    },
    {
      name: "autoSave",
      type: "string",
    },
    {
      name: "children",
      type: "string",
    },
    {
      name: "className",
      type: "string",
    },
    {
      name: "color",
      type: "string",
    },
    {
      name: "content",
      type: "string",
    },
    {
      name: "contentEditable",
      type: "string",
    },
    {
      name: "contextMenu",
      type: "string",
    },
    {
      name: "dangerouslySetInnerHTML",
      type: "string",
    },
    {
      name: "datatype",
      type: "string",
    },
    {
      name: "defaultChecked",
      type: "boolean",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "dir",
      type: "string",
    },
    {
      name: "draggable",
      type: "string",
    },
    {
      name: "hidden",
      type: "boolean",
    },
    {
      name: "id",
      type: "string",
    },
    {
      name: "inlist",
      type: "string",
    },
    {
      name: "inputMode",
      type: "string",
    },
    {
      name: "is",
      type: "string",
    },
    {
      name: "itemID",
      type: "string",
    },
    {
      name: "itemProp",
      type: "string",
    },
    {
      name: "itemRef",
      type: "string",
    },
    {
      name: "itemScope",
      type: "boolean",
    },
    {
      name: "itemType",
      type: "string",
    },
    {
      name: "lang",
      type: "string",
    },
    {
      name: "nonce",
      type: "string",
    },
    {
      name: "onAbort",
      type: "string",
    },
    {
      name: "onAbortCapture",
      type: "string",
    },
    {
      name: "onAnimationEnd",
      type: "string",
    },
    {
      name: "onAnimationEndCapture",
      type: "string",
    },
    {
      name: "onAnimationIteration",
      type: "string",
    },
    {
      name: "onAnimationIterationCapture",
      type: "string",
    },
    {
      name: "onAnimationStart",
      type: "string",
    },
    {
      name: "onAnimationStartCapture",
      type: "string",
    },
    {
      name: "onAuxClick",
      type: "string",
    },
    {
      name: "onAuxClickCapture",
      type: "string",
    },
    {
      name: "onBeforeInput",
      type: "string",
    },
    {
      name: "onBeforeInputCapture",
      type: "string",
    },
    {
      name: "onBlur",
      type: "string",
    },
    {
      name: "onBlurCapture",
      type: "string",
    },
    {
      name: "onCanPlay",
      type: "string",
    },
    {
      name: "onCanPlayCapture",
      type: "string",
    },
    {
      name: "onCanPlayThrough",
      type: "string",
    },
    {
      name: "onCanPlayThroughCapture",
      type: "string",
    },
    {
      name: "onChange",
      type: "string",
    },
    {
      name: "onChangeCapture",
      type: "string",
    },
    {
      name: "onClick",
      type: "string",
    },
    {
      name: "onClickCapture",
      type: "string",
    },
    {
      name: "onCompositionEnd",
      type: "string",
    },
    {
      name: "onCompositionEndCapture",
      type: "string",
    },
    {
      name: "onCompositionStart",
      type: "string",
    },
    {
      name: "onCompositionStartCapture",
      type: "string",
    },
    {
      name: "onCompositionUpdate",
      type: "string",
    },
    {
      name: "onCompositionUpdateCapture",
      type: "string",
    },
    {
      name: "onContextMenu",
      type: "string",
    },
    {
      name: "onContextMenuCapture",
      type: "string",
    },
    {
      name: "onCopy",
      type: "string",
    },
    {
      name: "onCopyCapture",
      type: "string",
    },
    {
      name: "onCut",
      type: "string",
    },
    {
      name: "onCutCapture",
      type: "string",
    },
    {
      name: "onDoubleClick",
      type: "string",
    },
    {
      name: "onDoubleClickCapture",
      type: "string",
    },
    {
      name: "onDrag",
      type: "string",
    },
    {
      name: "onDragCapture",
      type: "string",
    },
    {
      name: "onDragEnd",
      type: "string",
    },
    {
      name: "onDragEndCapture",
      type: "string",
    },
    {
      name: "onDragEnter",
      type: "string",
    },
    {
      name: "onDragEnterCapture",
      type: "string",
    },
    {
      name: "onDragExit",
      type: "string",
    },
    {
      name: "onDragExitCapture",
      type: "string",
    },
    {
      name: "onDragLeave",
      type: "string",
    },
    {
      name: "onDragLeaveCapture",
      type: "string",
    },
    {
      name: "onDragOver",
      type: "string",
    },
    {
      name: "onDragOverCapture",
      type: "string",
    },
    {
      name: "onDragStart",
      type: "string",
    },
    {
      name: "onDragStartCapture",
      type: "string",
    },
    {
      name: "onDrop",
      type: "string",
    },
    {
      name: "onDropCapture",
      type: "string",
    },
    {
      name: "onDurationChange",
      type: "string",
    },
    {
      name: "onDurationChangeCapture",
      type: "string",
    },
    {
      name: "onEmptied",
      type: "string",
    },
    {
      name: "onEmptiedCapture",
      type: "string",
    },
    {
      name: "onEncrypted",
      type: "string",
    },
    {
      name: "onEncryptedCapture",
      type: "string",
    },
    {
      name: "onEnded",
      type: "string",
    },
    {
      name: "onEndedCapture",
      type: "string",
    },
    {
      name: "onError",
      type: "string",
    },
    {
      name: "onErrorCapture",
      type: "string",
    },
    {
      name: "onFocus",
      type: "string",
    },
    {
      name: "onFocusCapture",
      type: "string",
    },
    {
      name: "onGotPointerCapture",
      type: "string",
    },
    {
      name: "onGotPointerCaptureCapture",
      type: "string",
    },
    {
      name: "onInput",
      type: "string",
    },
    {
      name: "onInputCapture",
      type: "string",
    },
    {
      name: "onInvalid",
      type: "string",
    },
    {
      name: "onInvalidCapture",
      type: "string",
    },
    {
      name: "onKeyDown",
      type: "string",
    },
    {
      name: "onKeyDownCapture",
      type: "string",
    },
    {
      name: "onKeyPress",
      type: "string",
    },
    {
      name: "onKeyPressCapture",
      type: "string",
    },
    {
      name: "onKeyUp",
      type: "string",
    },
    {
      name: "onKeyUpCapture",
      type: "string",
    },
    {
      name: "onLoad",
      type: "string",
    },
    {
      name: "onLoadCapture",
      type: "string",
    },
    {
      name: "onLoadedData",
      type: "string",
    },
    {
      name: "onLoadedDataCapture",
      type: "string",
    },
    {
      name: "onLoadedMetadata",
      type: "string",
    },
    {
      name: "onLoadedMetadataCapture",
      type: "string",
    },
    {
      name: "onLoadStart",
      type: "string",
    },
    {
      name: "onLoadStartCapture",
      type: "string",
    },
    {
      name: "onLostPointerCapture",
      type: "string",
    },
    {
      name: "onLostPointerCaptureCapture",
      type: "string",
    },
    {
      name: "onMouseDown",
      type: "string",
    },
    {
      name: "onMouseDownCapture",
      type: "string",
    },
    {
      name: "onMouseEnter",
      type: "string",
    },
    {
      name: "onMouseLeave",
      type: "string",
    },
    {
      name: "onMouseMove",
      type: "string",
    },
    {
      name: "onMouseMoveCapture",
      type: "string",
    },
    {
      name: "onMouseOut",
      type: "string",
    },
    {
      name: "onMouseOutCapture",
      type: "string",
    },
    {
      name: "onMouseOver",
      type: "string",
    },
    {
      name: "onMouseOverCapture",
      type: "string",
    },
    {
      name: "onMouseUp",
      type: "string",
    },
    {
      name: "onMouseUpCapture",
      type: "string",
    },
    {
      name: "onPaste",
      type: "string",
    },
    {
      name: "onPasteCapture",
      type: "string",
    },
    {
      name: "onPause",
      type: "string",
    },
    {
      name: "onPauseCapture",
      type: "string",
    },
    {
      name: "onPlay",
      type: "string",
    },
    {
      name: "onPlayCapture",
      type: "string",
    },
    {
      name: "onPlaying",
      type: "string",
    },
    {
      name: "onPlayingCapture",
      type: "string",
    },
    {
      name: "onPointerCancel",
      type: "string",
    },
    {
      name: "onPointerCancelCapture",
      type: "string",
    },
    {
      name: "onPointerDown",
      type: "string",
    },
    {
      name: "onPointerDownCapture",
      type: "string",
    },
    {
      name: "onPointerEnter",
      type: "string",
    },
    {
      name: "onPointerEnterCapture",
      type: "string",
    },
    {
      name: "onPointerLeave",
      type: "string",
    },
    {
      name: "onPointerLeaveCapture",
      type: "string",
    },
    {
      name: "onPointerMove",
      type: "string",
    },
    {
      name: "onPointerMoveCapture",
      type: "string",
    },
    {
      name: "onPointerOut",
      type: "string",
    },
    {
      name: "onPointerOutCapture",
      type: "string",
    },
    {
      name: "onPointerOver",
      type: "string",
    },
    {
      name: "onPointerOverCapture",
      type: "string",
    },
    {
      name: "onPointerUp",
      type: "string",
    },
    {
      name: "onPointerUpCapture",
      type: "string",
    },
    {
      name: "onProgress",
      type: "string",
    },
    {
      name: "onProgressCapture",
      type: "string",
    },
    {
      name: "onRateChange",
      type: "string",
    },
    {
      name: "onRateChangeCapture",
      type: "string",
    },
    {
      name: "onReset",
      type: "string",
    },
    {
      name: "onResetCapture",
      type: "string",
    },
    {
      name: "onResize",
      type: "string",
    },
    {
      name: "onResizeCapture",
      type: "string",
    },
    {
      name: "onScroll",
      type: "string",
    },
    {
      name: "onScrollCapture",
      type: "string",
    },
    {
      name: "onSeeked",
      type: "string",
    },
    {
      name: "onSeekedCapture",
      type: "string",
    },
    {
      name: "onSeeking",
      type: "string",
    },
    {
      name: "onSeekingCapture",
      type: "string",
    },
    {
      name: "onSelect",
      type: "string",
    },
    {
      name: "onSelectCapture",
      type: "string",
    },
    {
      name: "onStalled",
      type: "string",
    },
    {
      name: "onStalledCapture",
      type: "string",
    },
    {
      name: "onSubmit",
      type: "string",
    },
    {
      name: "onSubmitCapture",
      type: "string",
    },
    {
      name: "onSuspend",
      type: "string",
    },
    {
      name: "onSuspendCapture",
      type: "string",
    },
    {
      name: "onTimeUpdate",
      type: "string",
    },
    {
      name: "onTimeUpdateCapture",
      type: "string",
    },
    {
      name: "onTouchCancel",
      type: "string",
    },
    {
      name: "onTouchCancelCapture",
      type: "string",
    },
    {
      name: "onTouchEnd",
      type: "string",
    },
    {
      name: "onTouchEndCapture",
      type: "string",
    },
    {
      name: "onTouchMove",
      type: "string",
    },
    {
      name: "onTouchMoveCapture",
      type: "string",
    },
    {
      name: "onTouchStart",
      type: "string",
    },
    {
      name: "onTouchStartCapture",
      type: "string",
    },
    {
      name: "onTransitionEnd",
      type: "string",
    },
    {
      name: "onTransitionEndCapture",
      type: "string",
    },
    {
      name: "onVolumeChange",
      type: "string",
    },
    {
      name: "onVolumeChangeCapture",
      type: "string",
    },
    {
      name: "onWaiting",
      type: "string",
    },
    {
      name: "onWaitingCapture",
      type: "string",
    },
    {
      name: "onWheel",
      type: "string",
    },
    {
      name: "onWheelCapture",
      type: "string",
    },
    {
      name: "placeholder",
      type: "string",
    },
    {
      name: "prefix",
      type: "string",
    },
    {
      name: "property",
      type: "string",
    },
    {
      name: "radioGroup",
      type: "string",
    },
    {
      name: "rel",
      type: "string",
    },
    {
      name: "resource",
      type: "string",
    },
    {
      name: "results",
      type: "number",
    },
    {
      name: "rev",
      type: "string",
    },
    {
      name: "role",
      type: "string",
    },
    {
      name: "security",
      type: "string",
    },
    {
      name: "slot",
      type: "string",
    },
    {
      name: "spellCheck",
      type: "string",
    },
    {
      name: "style",
      type: "string",
    },
    {
      name: "suppressContentEditableWarning",
      type: "boolean",
    },
    {
      name: "suppressHydrationWarning",
      type: "boolean",
    },
    {
      name: "tabIndex",
      type: "number",
    },
    {
      name: "title",
      type: "string",
    },
    {
      name: "translate",
      type: "string",
    },
    {
      name: "typeof",
      type: "string",
    },
    {
      name: "unselectable",
      type: "string",
    },
    {
      name: "vocab",
      type: "string",
    },
  ],
});

Builder.registerComponent(AlertDescription, {
  name: "AlertDescription",
  inputs: [
    {
      name: "about",
      type: "string",
    },
    {
      name: "accessKey",
      type: "string",
    },
    {
      name: "aria-activedescendant",
      type: "string",
    },
    {
      name: "aria-atomic",
      type: "string",
    },
    {
      name: "aria-autocomplete",
      type: "string",
    },
    {
      name: "aria-braillelabel",
      type: "string",
    },
    {
      name: "aria-brailleroledescription",
      type: "string",
    },
    {
      name: "aria-busy",
      type: "string",
    },
    {
      name: "aria-checked",
      type: "string",
    },
    {
      name: "aria-colcount",
      type: "number",
    },
    {
      name: "aria-colindex",
      type: "number",
    },
    {
      name: "aria-colindextext",
      type: "string",
    },
    {
      name: "aria-colspan",
      type: "number",
    },
    {
      name: "aria-controls",
      type: "string",
    },
    {
      name: "aria-current",
      type: "string",
    },
    {
      name: "aria-describedby",
      type: "string",
    },
    {
      name: "aria-description",
      type: "string",
    },
    {
      name: "aria-details",
      type: "string",
    },
    {
      name: "aria-disabled",
      type: "string",
    },
    {
      name: "aria-dropeffect",
      type: "string",
    },
    {
      name: "aria-errormessage",
      type: "string",
    },
    {
      name: "aria-expanded",
      type: "string",
    },
    {
      name: "aria-flowto",
      type: "string",
    },
    {
      name: "aria-grabbed",
      type: "string",
    },
    {
      name: "aria-haspopup",
      type: "string",
    },
    {
      name: "aria-hidden",
      type: "string",
    },
    {
      name: "aria-invalid",
      type: "string",
    },
    {
      name: "aria-keyshortcuts",
      type: "string",
    },
    {
      name: "aria-label",
      type: "string",
    },
    {
      name: "aria-labelledby",
      type: "string",
    },
    {
      name: "aria-level",
      type: "number",
    },
    {
      name: "aria-live",
      type: "string",
    },
    {
      name: "aria-modal",
      type: "string",
    },
    {
      name: "aria-multiline",
      type: "string",
    },
    {
      name: "aria-multiselectable",
      type: "string",
    },
    {
      name: "aria-orientation",
      type: "string",
    },
    {
      name: "aria-owns",
      type: "string",
    },
    {
      name: "aria-placeholder",
      type: "string",
    },
    {
      name: "aria-posinset",
      type: "number",
    },
    {
      name: "aria-pressed",
      type: "string",
    },
    {
      name: "aria-readonly",
      type: "string",
    },
    {
      name: "aria-relevant",
      type: "string",
    },
    {
      name: "aria-required",
      type: "string",
    },
    {
      name: "aria-roledescription",
      type: "string",
    },
    {
      name: "aria-rowcount",
      type: "number",
    },
    {
      name: "aria-rowindex",
      type: "number",
    },
    {
      name: "aria-rowindextext",
      type: "string",
    },
    {
      name: "aria-rowspan",
      type: "number",
    },
    {
      name: "aria-selected",
      type: "string",
    },
    {
      name: "aria-setsize",
      type: "number",
    },
    {
      name: "aria-sort",
      type: "string",
    },
    {
      name: "aria-valuemax",
      type: "number",
    },
    {
      name: "aria-valuemin",
      type: "number",
    },
    {
      name: "aria-valuenow",
      type: "number",
    },
    {
      name: "aria-valuetext",
      type: "string",
    },
    {
      name: "autoCapitalize",
      type: "string",
    },
    {
      name: "autoCorrect",
      type: "string",
    },
    {
      name: "autoFocus",
      type: "boolean",
    },
    {
      name: "autoSave",
      type: "string",
    },
    {
      name: "children",
      type: "string",
    },
    {
      name: "className",
      type: "string",
    },
    {
      name: "color",
      type: "string",
    },
    {
      name: "content",
      type: "string",
    },
    {
      name: "contentEditable",
      type: "string",
    },
    {
      name: "contextMenu",
      type: "string",
    },
    {
      name: "dangerouslySetInnerHTML",
      type: "string",
    },
    {
      name: "datatype",
      type: "string",
    },
    {
      name: "defaultChecked",
      type: "boolean",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "dir",
      type: "string",
    },
    {
      name: "draggable",
      type: "string",
    },
    {
      name: "hidden",
      type: "boolean",
    },
    {
      name: "id",
      type: "string",
    },
    {
      name: "inlist",
      type: "string",
    },
    {
      name: "inputMode",
      type: "string",
    },
    {
      name: "is",
      type: "string",
    },
    {
      name: "itemID",
      type: "string",
    },
    {
      name: "itemProp",
      type: "string",
    },
    {
      name: "itemRef",
      type: "string",
    },
    {
      name: "itemScope",
      type: "boolean",
    },
    {
      name: "itemType",
      type: "string",
    },
    {
      name: "lang",
      type: "string",
    },
    {
      name: "nonce",
      type: "string",
    },
    {
      name: "onAbort",
      type: "string",
    },
    {
      name: "onAbortCapture",
      type: "string",
    },
    {
      name: "onAnimationEnd",
      type: "string",
    },
    {
      name: "onAnimationEndCapture",
      type: "string",
    },
    {
      name: "onAnimationIteration",
      type: "string",
    },
    {
      name: "onAnimationIterationCapture",
      type: "string",
    },
    {
      name: "onAnimationStart",
      type: "string",
    },
    {
      name: "onAnimationStartCapture",
      type: "string",
    },
    {
      name: "onAuxClick",
      type: "string",
    },
    {
      name: "onAuxClickCapture",
      type: "string",
    },
    {
      name: "onBeforeInput",
      type: "string",
    },
    {
      name: "onBeforeInputCapture",
      type: "string",
    },
    {
      name: "onBlur",
      type: "string",
    },
    {
      name: "onBlurCapture",
      type: "string",
    },
    {
      name: "onCanPlay",
      type: "string",
    },
    {
      name: "onCanPlayCapture",
      type: "string",
    },
    {
      name: "onCanPlayThrough",
      type: "string",
    },
    {
      name: "onCanPlayThroughCapture",
      type: "string",
    },
    {
      name: "onChange",
      type: "string",
    },
    {
      name: "onChangeCapture",
      type: "string",
    },
    {
      name: "onClick",
      type: "string",
    },
    {
      name: "onClickCapture",
      type: "string",
    },
    {
      name: "onCompositionEnd",
      type: "string",
    },
    {
      name: "onCompositionEndCapture",
      type: "string",
    },
    {
      name: "onCompositionStart",
      type: "string",
    },
    {
      name: "onCompositionStartCapture",
      type: "string",
    },
    {
      name: "onCompositionUpdate",
      type: "string",
    },
    {
      name: "onCompositionUpdateCapture",
      type: "string",
    },
    {
      name: "onContextMenu",
      type: "string",
    },
    {
      name: "onContextMenuCapture",
      type: "string",
    },
    {
      name: "onCopy",
      type: "string",
    },
    {
      name: "onCopyCapture",
      type: "string",
    },
    {
      name: "onCut",
      type: "string",
    },
    {
      name: "onCutCapture",
      type: "string",
    },
    {
      name: "onDoubleClick",
      type: "string",
    },
    {
      name: "onDoubleClickCapture",
      type: "string",
    },
    {
      name: "onDrag",
      type: "string",
    },
    {
      name: "onDragCapture",
      type: "string",
    },
    {
      name: "onDragEnd",
      type: "string",
    },
    {
      name: "onDragEndCapture",
      type: "string",
    },
    {
      name: "onDragEnter",
      type: "string",
    },
    {
      name: "onDragEnterCapture",
      type: "string",
    },
    {
      name: "onDragExit",
      type: "string",
    },
    {
      name: "onDragExitCapture",
      type: "string",
    },
    {
      name: "onDragLeave",
      type: "string",
    },
    {
      name: "onDragLeaveCapture",
      type: "string",
    },
    {
      name: "onDragOver",
      type: "string",
    },
    {
      name: "onDragOverCapture",
      type: "string",
    },
    {
      name: "onDragStart",
      type: "string",
    },
    {
      name: "onDragStartCapture",
      type: "string",
    },
    {
      name: "onDrop",
      type: "string",
    },
    {
      name: "onDropCapture",
      type: "string",
    },
    {
      name: "onDurationChange",
      type: "string",
    },
    {
      name: "onDurationChangeCapture",
      type: "string",
    },
    {
      name: "onEmptied",
      type: "string",
    },
    {
      name: "onEmptiedCapture",
      type: "string",
    },
    {
      name: "onEncrypted",
      type: "string",
    },
    {
      name: "onEncryptedCapture",
      type: "string",
    },
    {
      name: "onEnded",
      type: "string",
    },
    {
      name: "onEndedCapture",
      type: "string",
    },
    {
      name: "onError",
      type: "string",
    },
    {
      name: "onErrorCapture",
      type: "string",
    },
    {
      name: "onFocus",
      type: "string",
    },
    {
      name: "onFocusCapture",
      type: "string",
    },
    {
      name: "onGotPointerCapture",
      type: "string",
    },
    {
      name: "onGotPointerCaptureCapture",
      type: "string",
    },
    {
      name: "onInput",
      type: "string",
    },
    {
      name: "onInputCapture",
      type: "string",
    },
    {
      name: "onInvalid",
      type: "string",
    },
    {
      name: "onInvalidCapture",
      type: "string",
    },
    {
      name: "onKeyDown",
      type: "string",
    },
    {
      name: "onKeyDownCapture",
      type: "string",
    },
    {
      name: "onKeyPress",
      type: "string",
    },
    {
      name: "onKeyPressCapture",
      type: "string",
    },
    {
      name: "onKeyUp",
      type: "string",
    },
    {
      name: "onKeyUpCapture",
      type: "string",
    },
    {
      name: "onLoad",
      type: "string",
    },
    {
      name: "onLoadCapture",
      type: "string",
    },
    {
      name: "onLoadedData",
      type: "string",
    },
    {
      name: "onLoadedDataCapture",
      type: "string",
    },
    {
      name: "onLoadedMetadata",
      type: "string",
    },
    {
      name: "onLoadedMetadataCapture",
      type: "string",
    },
    {
      name: "onLoadStart",
      type: "string",
    },
    {
      name: "onLoadStartCapture",
      type: "string",
    },
    {
      name: "onLostPointerCapture",
      type: "string",
    },
    {
      name: "onLostPointerCaptureCapture",
      type: "string",
    },
    {
      name: "onMouseDown",
      type: "string",
    },
    {
      name: "onMouseDownCapture",
      type: "string",
    },
    {
      name: "onMouseEnter",
      type: "string",
    },
    {
      name: "onMouseLeave",
      type: "string",
    },
    {
      name: "onMouseMove",
      type: "string",
    },
    {
      name: "onMouseMoveCapture",
      type: "string",
    },
    {
      name: "onMouseOut",
      type: "string",
    },
    {
      name: "onMouseOutCapture",
      type: "string",
    },
    {
      name: "onMouseOver",
      type: "string",
    },
    {
      name: "onMouseOverCapture",
      type: "string",
    },
    {
      name: "onMouseUp",
      type: "string",
    },
    {
      name: "onMouseUpCapture",
      type: "string",
    },
    {
      name: "onPaste",
      type: "string",
    },
    {
      name: "onPasteCapture",
      type: "string",
    },
    {
      name: "onPause",
      type: "string",
    },
    {
      name: "onPauseCapture",
      type: "string",
    },
    {
      name: "onPlay",
      type: "string",
    },
    {
      name: "onPlayCapture",
      type: "string",
    },
    {
      name: "onPlaying",
      type: "string",
    },
    {
      name: "onPlayingCapture",
      type: "string",
    },
    {
      name: "onPointerCancel",
      type: "string",
    },
    {
      name: "onPointerCancelCapture",
      type: "string",
    },
    {
      name: "onPointerDown",
      type: "string",
    },
    {
      name: "onPointerDownCapture",
      type: "string",
    },
    {
      name: "onPointerEnter",
      type: "string",
    },
    {
      name: "onPointerEnterCapture",
      type: "string",
    },
    {
      name: "onPointerLeave",
      type: "string",
    },
    {
      name: "onPointerLeaveCapture",
      type: "string",
    },
    {
      name: "onPointerMove",
      type: "string",
    },
    {
      name: "onPointerMoveCapture",
      type: "string",
    },
    {
      name: "onPointerOut",
      type: "string",
    },
    {
      name: "onPointerOutCapture",
      type: "string",
    },
    {
      name: "onPointerOver",
      type: "string",
    },
    {
      name: "onPointerOverCapture",
      type: "string",
    },
    {
      name: "onPointerUp",
      type: "string",
    },
    {
      name: "onPointerUpCapture",
      type: "string",
    },
    {
      name: "onProgress",
      type: "string",
    },
    {
      name: "onProgressCapture",
      type: "string",
    },
    {
      name: "onRateChange",
      type: "string",
    },
    {
      name: "onRateChangeCapture",
      type: "string",
    },
    {
      name: "onReset",
      type: "string",
    },
    {
      name: "onResetCapture",
      type: "string",
    },
    {
      name: "onResize",
      type: "string",
    },
    {
      name: "onResizeCapture",
      type: "string",
    },
    {
      name: "onScroll",
      type: "string",
    },
    {
      name: "onScrollCapture",
      type: "string",
    },
    {
      name: "onSeeked",
      type: "string",
    },
    {
      name: "onSeekedCapture",
      type: "string",
    },
    {
      name: "onSeeking",
      type: "string",
    },
    {
      name: "onSeekingCapture",
      type: "string",
    },
    {
      name: "onSelect",
      type: "string",
    },
    {
      name: "onSelectCapture",
      type: "string",
    },
    {
      name: "onStalled",
      type: "string",
    },
    {
      name: "onStalledCapture",
      type: "string",
    },
    {
      name: "onSubmit",
      type: "string",
    },
    {
      name: "onSubmitCapture",
      type: "string",
    },
    {
      name: "onSuspend",
      type: "string",
    },
    {
      name: "onSuspendCapture",
      type: "string",
    },
    {
      name: "onTimeUpdate",
      type: "string",
    },
    {
      name: "onTimeUpdateCapture",
      type: "string",
    },
    {
      name: "onTouchCancel",
      type: "string",
    },
    {
      name: "onTouchCancelCapture",
      type: "string",
    },
    {
      name: "onTouchEnd",
      type: "string",
    },
    {
      name: "onTouchEndCapture",
      type: "string",
    },
    {
      name: "onTouchMove",
      type: "string",
    },
    {
      name: "onTouchMoveCapture",
      type: "string",
    },
    {
      name: "onTouchStart",
      type: "string",
    },
    {
      name: "onTouchStartCapture",
      type: "string",
    },
    {
      name: "onTransitionEnd",
      type: "string",
    },
    {
      name: "onTransitionEndCapture",
      type: "string",
    },
    {
      name: "onVolumeChange",
      type: "string",
    },
    {
      name: "onVolumeChangeCapture",
      type: "string",
    },
    {
      name: "onWaiting",
      type: "string",
    },
    {
      name: "onWaitingCapture",
      type: "string",
    },
    {
      name: "onWheel",
      type: "string",
    },
    {
      name: "onWheelCapture",
      type: "string",
    },
    {
      name: "placeholder",
      type: "string",
    },
    {
      name: "prefix",
      type: "string",
    },
    {
      name: "property",
      type: "string",
    },
    {
      name: "radioGroup",
      type: "string",
    },
    {
      name: "rel",
      type: "string",
    },
    {
      name: "resource",
      type: "string",
    },
    {
      name: "results",
      type: "number",
    },
    {
      name: "rev",
      type: "string",
    },
    {
      name: "role",
      type: "string",
    },
    {
      name: "security",
      type: "string",
    },
    {
      name: "slot",
      type: "string",
    },
    {
      name: "spellCheck",
      type: "string",
    },
    {
      name: "style",
      type: "string",
    },
    {
      name: "suppressContentEditableWarning",
      type: "boolean",
    },
    {
      name: "suppressHydrationWarning",
      type: "boolean",
    },
    {
      name: "tabIndex",
      type: "number",
    },
    {
      name: "title",
      type: "string",
    },
    {
      name: "translate",
      type: "string",
    },
    {
      name: "typeof",
      type: "string",
    },
    {
      name: "unselectable",
      type: "string",
    },
    {
      name: "vocab",
      type: "string",
    },
  ],
});

Builder.registerComponent(AlertTitle, {
  name: "AlertTitle",
  inputs: [
    {
      name: "about",
      type: "string",
    },
    {
      name: "accessKey",
      type: "string",
    },
    {
      name: "aria-activedescendant",
      type: "string",
    },
    {
      name: "aria-atomic",
      type: "string",
    },
    {
      name: "aria-autocomplete",
      type: "string",
    },
    {
      name: "aria-braillelabel",
      type: "string",
    },
    {
      name: "aria-brailleroledescription",
      type: "string",
    },
    {
      name: "aria-busy",
      type: "string",
    },
    {
      name: "aria-checked",
      type: "string",
    },
    {
      name: "aria-colcount",
      type: "number",
    },
    {
      name: "aria-colindex",
      type: "number",
    },
    {
      name: "aria-colindextext",
      type: "string",
    },
    {
      name: "aria-colspan",
      type: "number",
    },
    {
      name: "aria-controls",
      type: "string",
    },
    {
      name: "aria-current",
      type: "string",
    },
    {
      name: "aria-describedby",
      type: "string",
    },
    {
      name: "aria-description",
      type: "string",
    },
    {
      name: "aria-details",
      type: "string",
    },
    {
      name: "aria-disabled",
      type: "string",
    },
    {
      name: "aria-dropeffect",
      type: "string",
    },
    {
      name: "aria-errormessage",
      type: "string",
    },
    {
      name: "aria-expanded",
      type: "string",
    },
    {
      name: "aria-flowto",
      type: "string",
    },
    {
      name: "aria-grabbed",
      type: "string",
    },
    {
      name: "aria-haspopup",
      type: "string",
    },
    {
      name: "aria-hidden",
      type: "string",
    },
    {
      name: "aria-invalid",
      type: "string",
    },
    {
      name: "aria-keyshortcuts",
      type: "string",
    },
    {
      name: "aria-label",
      type: "string",
    },
    {
      name: "aria-labelledby",
      type: "string",
    },
    {
      name: "aria-level",
      type: "number",
    },
    {
      name: "aria-live",
      type: "string",
    },
    {
      name: "aria-modal",
      type: "string",
    },
    {
      name: "aria-multiline",
      type: "string",
    },
    {
      name: "aria-multiselectable",
      type: "string",
    },
    {
      name: "aria-orientation",
      type: "string",
    },
    {
      name: "aria-owns",
      type: "string",
    },
    {
      name: "aria-placeholder",
      type: "string",
    },
    {
      name: "aria-posinset",
      type: "number",
    },
    {
      name: "aria-pressed",
      type: "string",
    },
    {
      name: "aria-readonly",
      type: "string",
    },
    {
      name: "aria-relevant",
      type: "string",
    },
    {
      name: "aria-required",
      type: "string",
    },
    {
      name: "aria-roledescription",
      type: "string",
    },
    {
      name: "aria-rowcount",
      type: "number",
    },
    {
      name: "aria-rowindex",
      type: "number",
    },
    {
      name: "aria-rowindextext",
      type: "string",
    },
    {
      name: "aria-rowspan",
      type: "number",
    },
    {
      name: "aria-selected",
      type: "string",
    },
    {
      name: "aria-setsize",
      type: "number",
    },
    {
      name: "aria-sort",
      type: "string",
    },
    {
      name: "aria-valuemax",
      type: "number",
    },
    {
      name: "aria-valuemin",
      type: "number",
    },
    {
      name: "aria-valuenow",
      type: "number",
    },
    {
      name: "aria-valuetext",
      type: "string",
    },
    {
      name: "autoCapitalize",
      type: "string",
    },
    {
      name: "autoCorrect",
      type: "string",
    },
    {
      name: "autoFocus",
      type: "boolean",
    },
    {
      name: "autoSave",
      type: "string",
    },
    {
      name: "children",
      type: "string",
    },
    {
      name: "className",
      type: "string",
    },
    {
      name: "color",
      type: "string",
    },
    {
      name: "content",
      type: "string",
    },
    {
      name: "contentEditable",
      type: "string",
    },
    {
      name: "contextMenu",
      type: "string",
    },
    {
      name: "dangerouslySetInnerHTML",
      type: "string",
    },
    {
      name: "datatype",
      type: "string",
    },
    {
      name: "defaultChecked",
      type: "boolean",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "dir",
      type: "string",
    },
    {
      name: "draggable",
      type: "string",
    },
    {
      name: "hidden",
      type: "boolean",
    },
    {
      name: "id",
      type: "string",
    },
    {
      name: "inlist",
      type: "string",
    },
    {
      name: "inputMode",
      type: "string",
    },
    {
      name: "is",
      type: "string",
    },
    {
      name: "itemID",
      type: "string",
    },
    {
      name: "itemProp",
      type: "string",
    },
    {
      name: "itemRef",
      type: "string",
    },
    {
      name: "itemScope",
      type: "boolean",
    },
    {
      name: "itemType",
      type: "string",
    },
    {
      name: "lang",
      type: "string",
    },
    {
      name: "nonce",
      type: "string",
    },
    {
      name: "onAbort",
      type: "string",
    },
    {
      name: "onAbortCapture",
      type: "string",
    },
    {
      name: "onAnimationEnd",
      type: "string",
    },
    {
      name: "onAnimationEndCapture",
      type: "string",
    },
    {
      name: "onAnimationIteration",
      type: "string",
    },
    {
      name: "onAnimationIterationCapture",
      type: "string",
    },
    {
      name: "onAnimationStart",
      type: "string",
    },
    {
      name: "onAnimationStartCapture",
      type: "string",
    },
    {
      name: "onAuxClick",
      type: "string",
    },
    {
      name: "onAuxClickCapture",
      type: "string",
    },
    {
      name: "onBeforeInput",
      type: "string",
    },
    {
      name: "onBeforeInputCapture",
      type: "string",
    },
    {
      name: "onBlur",
      type: "string",
    },
    {
      name: "onBlurCapture",
      type: "string",
    },
    {
      name: "onCanPlay",
      type: "string",
    },
    {
      name: "onCanPlayCapture",
      type: "string",
    },
    {
      name: "onCanPlayThrough",
      type: "string",
    },
    {
      name: "onCanPlayThroughCapture",
      type: "string",
    },
    {
      name: "onChange",
      type: "string",
    },
    {
      name: "onChangeCapture",
      type: "string",
    },
    {
      name: "onClick",
      type: "string",
    },
    {
      name: "onClickCapture",
      type: "string",
    },
    {
      name: "onCompositionEnd",
      type: "string",
    },
    {
      name: "onCompositionEndCapture",
      type: "string",
    },
    {
      name: "onCompositionStart",
      type: "string",
    },
    {
      name: "onCompositionStartCapture",
      type: "string",
    },
    {
      name: "onCompositionUpdate",
      type: "string",
    },
    {
      name: "onCompositionUpdateCapture",
      type: "string",
    },
    {
      name: "onContextMenu",
      type: "string",
    },
    {
      name: "onContextMenuCapture",
      type: "string",
    },
    {
      name: "onCopy",
      type: "string",
    },
    {
      name: "onCopyCapture",
      type: "string",
    },
    {
      name: "onCut",
      type: "string",
    },
    {
      name: "onCutCapture",
      type: "string",
    },
    {
      name: "onDoubleClick",
      type: "string",
    },
    {
      name: "onDoubleClickCapture",
      type: "string",
    },
    {
      name: "onDrag",
      type: "string",
    },
    {
      name: "onDragCapture",
      type: "string",
    },
    {
      name: "onDragEnd",
      type: "string",
    },
    {
      name: "onDragEndCapture",
      type: "string",
    },
    {
      name: "onDragEnter",
      type: "string",
    },
    {
      name: "onDragEnterCapture",
      type: "string",
    },
    {
      name: "onDragExit",
      type: "string",
    },
    {
      name: "onDragExitCapture",
      type: "string",
    },
    {
      name: "onDragLeave",
      type: "string",
    },
    {
      name: "onDragLeaveCapture",
      type: "string",
    },
    {
      name: "onDragOver",
      type: "string",
    },
    {
      name: "onDragOverCapture",
      type: "string",
    },
    {
      name: "onDragStart",
      type: "string",
    },
    {
      name: "onDragStartCapture",
      type: "string",
    },
    {
      name: "onDrop",
      type: "string",
    },
    {
      name: "onDropCapture",
      type: "string",
    },
    {
      name: "onDurationChange",
      type: "string",
    },
    {
      name: "onDurationChangeCapture",
      type: "string",
    },
    {
      name: "onEmptied",
      type: "string",
    },
    {
      name: "onEmptiedCapture",
      type: "string",
    },
    {
      name: "onEncrypted",
      type: "string",
    },
    {
      name: "onEncryptedCapture",
      type: "string",
    },
    {
      name: "onEnded",
      type: "string",
    },
    {
      name: "onEndedCapture",
      type: "string",
    },
    {
      name: "onError",
      type: "string",
    },
    {
      name: "onErrorCapture",
      type: "string",
    },
    {
      name: "onFocus",
      type: "string",
    },
    {
      name: "onFocusCapture",
      type: "string",
    },
    {
      name: "onGotPointerCapture",
      type: "string",
    },
    {
      name: "onGotPointerCaptureCapture",
      type: "string",
    },
    {
      name: "onInput",
      type: "string",
    },
    {
      name: "onInputCapture",
      type: "string",
    },
    {
      name: "onInvalid",
      type: "string",
    },
    {
      name: "onInvalidCapture",
      type: "string",
    },
    {
      name: "onKeyDown",
      type: "string",
    },
    {
      name: "onKeyDownCapture",
      type: "string",
    },
    {
      name: "onKeyPress",
      type: "string",
    },
    {
      name: "onKeyPressCapture",
      type: "string",
    },
    {
      name: "onKeyUp",
      type: "string",
    },
    {
      name: "onKeyUpCapture",
      type: "string",
    },
    {
      name: "onLoad",
      type: "string",
    },
    {
      name: "onLoadCapture",
      type: "string",
    },
    {
      name: "onLoadedData",
      type: "string",
    },
    {
      name: "onLoadedDataCapture",
      type: "string",
    },
    {
      name: "onLoadedMetadata",
      type: "string",
    },
    {
      name: "onLoadedMetadataCapture",
      type: "string",
    },
    {
      name: "onLoadStart",
      type: "string",
    },
    {
      name: "onLoadStartCapture",
      type: "string",
    },
    {
      name: "onLostPointerCapture",
      type: "string",
    },
    {
      name: "onLostPointerCaptureCapture",
      type: "string",
    },
    {
      name: "onMouseDown",
      type: "string",
    },
    {
      name: "onMouseDownCapture",
      type: "string",
    },
    {
      name: "onMouseEnter",
      type: "string",
    },
    {
      name: "onMouseLeave",
      type: "string",
    },
    {
      name: "onMouseMove",
      type: "string",
    },
    {
      name: "onMouseMoveCapture",
      type: "string",
    },
    {
      name: "onMouseOut",
      type: "string",
    },
    {
      name: "onMouseOutCapture",
      type: "string",
    },
    {
      name: "onMouseOver",
      type: "string",
    },
    {
      name: "onMouseOverCapture",
      type: "string",
    },
    {
      name: "onMouseUp",
      type: "string",
    },
    {
      name: "onMouseUpCapture",
      type: "string",
    },
    {
      name: "onPaste",
      type: "string",
    },
    {
      name: "onPasteCapture",
      type: "string",
    },
    {
      name: "onPause",
      type: "string",
    },
    {
      name: "onPauseCapture",
      type: "string",
    },
    {
      name: "onPlay",
      type: "string",
    },
    {
      name: "onPlayCapture",
      type: "string",
    },
    {
      name: "onPlaying",
      type: "string",
    },
    {
      name: "onPlayingCapture",
      type: "string",
    },
    {
      name: "onPointerCancel",
      type: "string",
    },
    {
      name: "onPointerCancelCapture",
      type: "string",
    },
    {
      name: "onPointerDown",
      type: "string",
    },
    {
      name: "onPointerDownCapture",
      type: "string",
    },
    {
      name: "onPointerEnter",
      type: "string",
    },
    {
      name: "onPointerEnterCapture",
      type: "string",
    },
    {
      name: "onPointerLeave",
      type: "string",
    },
    {
      name: "onPointerLeaveCapture",
      type: "string",
    },
    {
      name: "onPointerMove",
      type: "string",
    },
    {
      name: "onPointerMoveCapture",
      type: "string",
    },
    {
      name: "onPointerOut",
      type: "string",
    },
    {
      name: "onPointerOutCapture",
      type: "string",
    },
    {
      name: "onPointerOver",
      type: "string",
    },
    {
      name: "onPointerOverCapture",
      type: "string",
    },
    {
      name: "onPointerUp",
      type: "string",
    },
    {
      name: "onPointerUpCapture",
      type: "string",
    },
    {
      name: "onProgress",
      type: "string",
    },
    {
      name: "onProgressCapture",
      type: "string",
    },
    {
      name: "onRateChange",
      type: "string",
    },
    {
      name: "onRateChangeCapture",
      type: "string",
    },
    {
      name: "onReset",
      type: "string",
    },
    {
      name: "onResetCapture",
      type: "string",
    },
    {
      name: "onResize",
      type: "string",
    },
    {
      name: "onResizeCapture",
      type: "string",
    },
    {
      name: "onScroll",
      type: "string",
    },
    {
      name: "onScrollCapture",
      type: "string",
    },
    {
      name: "onSeeked",
      type: "string",
    },
    {
      name: "onSeekedCapture",
      type: "string",
    },
    {
      name: "onSeeking",
      type: "string",
    },
    {
      name: "onSeekingCapture",
      type: "string",
    },
    {
      name: "onSelect",
      type: "string",
    },
    {
      name: "onSelectCapture",
      type: "string",
    },
    {
      name: "onStalled",
      type: "string",
    },
    {
      name: "onStalledCapture",
      type: "string",
    },
    {
      name: "onSubmit",
      type: "string",
    },
    {
      name: "onSubmitCapture",
      type: "string",
    },
    {
      name: "onSuspend",
      type: "string",
    },
    {
      name: "onSuspendCapture",
      type: "string",
    },
    {
      name: "onTimeUpdate",
      type: "string",
    },
    {
      name: "onTimeUpdateCapture",
      type: "string",
    },
    {
      name: "onTouchCancel",
      type: "string",
    },
    {
      name: "onTouchCancelCapture",
      type: "string",
    },
    {
      name: "onTouchEnd",
      type: "string",
    },
    {
      name: "onTouchEndCapture",
      type: "string",
    },
    {
      name: "onTouchMove",
      type: "string",
    },
    {
      name: "onTouchMoveCapture",
      type: "string",
    },
    {
      name: "onTouchStart",
      type: "string",
    },
    {
      name: "onTouchStartCapture",
      type: "string",
    },
    {
      name: "onTransitionEnd",
      type: "string",
    },
    {
      name: "onTransitionEndCapture",
      type: "string",
    },
    {
      name: "onVolumeChange",
      type: "string",
    },
    {
      name: "onVolumeChangeCapture",
      type: "string",
    },
    {
      name: "onWaiting",
      type: "string",
    },
    {
      name: "onWaitingCapture",
      type: "string",
    },
    {
      name: "onWheel",
      type: "string",
    },
    {
      name: "onWheelCapture",
      type: "string",
    },
    {
      name: "placeholder",
      type: "string",
    },
    {
      name: "prefix",
      type: "string",
    },
    {
      name: "property",
      type: "string",
    },
    {
      name: "radioGroup",
      type: "string",
    },
    {
      name: "rel",
      type: "string",
    },
    {
      name: "resource",
      type: "string",
    },
    {
      name: "results",
      type: "number",
    },
    {
      name: "rev",
      type: "string",
    },
    {
      name: "role",
      type: "string",
    },
    {
      name: "security",
      type: "string",
    },
    {
      name: "slot",
      type: "string",
    },
    {
      name: "spellCheck",
      type: "string",
    },
    {
      name: "style",
      type: "string",
    },
    {
      name: "suppressContentEditableWarning",
      type: "boolean",
    },
    {
      name: "suppressHydrationWarning",
      type: "boolean",
    },
    {
      name: "tabIndex",
      type: "number",
    },
    {
      name: "title",
      type: "string",
    },
    {
      name: "translate",
      type: "string",
    },
    {
      name: "typeof",
      type: "string",
    },
    {
      name: "unselectable",
      type: "string",
    },
    {
      name: "vocab",
      type: "string",
    },
  ],
});

Builder.registerComponent(AutoComplete, {
  name: "AutoComplete",
  inputs: [
    {
      name: "className",
      type: "string",
    },
    {
      name: "create",
      type: "boolean",
    },
    {
      name: "emptyOption",
      type: "boolean",
    },
    {
      name: "inputClassName",
      type: "string",
    },
    {
      name: "onChange",
      type: "string",
    },
    {
      name: "optionDisplayDirection",
      type: "string",
    },
    {
      name: "options",
      type: "string",
      required: true,
    },
    {
      name: "resetOnCreate",
      type: "boolean",
    },
    {
      name: "showOptions",
      type: "boolean",
    },
    {
      name: "updateOnQueryChange",
      type: "boolean",
    },
    {
      name: "value",
      type: "string",
    },
  ],
});

Builder.registerComponent(Badge, {
  name: "Badge",
  inputs: [
    {
      name: "about",
      type: "string",
    },
    {
      name: "accessKey",
      type: "string",
    },
    {
      name: "aria-activedescendant",
      type: "string",
    },
    {
      name: "aria-atomic",
      type: "string",
    },
    {
      name: "aria-autocomplete",
      type: "string",
    },
    {
      name: "aria-braillelabel",
      type: "string",
    },
    {
      name: "aria-brailleroledescription",
      type: "string",
    },
    {
      name: "aria-busy",
      type: "string",
    },
    {
      name: "aria-checked",
      type: "string",
    },
    {
      name: "aria-colcount",
      type: "number",
    },
    {
      name: "aria-colindex",
      type: "number",
    },
    {
      name: "aria-colindextext",
      type: "string",
    },
    {
      name: "aria-colspan",
      type: "number",
    },
    {
      name: "aria-controls",
      type: "string",
    },
    {
      name: "aria-current",
      type: "string",
    },
    {
      name: "aria-describedby",
      type: "string",
    },
    {
      name: "aria-description",
      type: "string",
    },
    {
      name: "aria-details",
      type: "string",
    },
    {
      name: "aria-disabled",
      type: "string",
    },
    {
      name: "aria-dropeffect",
      type: "string",
    },
    {
      name: "aria-errormessage",
      type: "string",
    },
    {
      name: "aria-expanded",
      type: "string",
    },
    {
      name: "aria-flowto",
      type: "string",
    },
    {
      name: "aria-grabbed",
      type: "string",
    },
    {
      name: "aria-haspopup",
      type: "string",
    },
    {
      name: "aria-hidden",
      type: "string",
    },
    {
      name: "aria-invalid",
      type: "string",
    },
    {
      name: "aria-keyshortcuts",
      type: "string",
    },
    {
      name: "aria-label",
      type: "string",
    },
    {
      name: "aria-labelledby",
      type: "string",
    },
    {
      name: "aria-level",
      type: "number",
    },
    {
      name: "aria-live",
      type: "string",
    },
    {
      name: "aria-modal",
      type: "string",
    },
    {
      name: "aria-multiline",
      type: "string",
    },
    {
      name: "aria-multiselectable",
      type: "string",
    },
    {
      name: "aria-orientation",
      type: "string",
    },
    {
      name: "aria-owns",
      type: "string",
    },
    {
      name: "aria-placeholder",
      type: "string",
    },
    {
      name: "aria-posinset",
      type: "number",
    },
    {
      name: "aria-pressed",
      type: "string",
    },
    {
      name: "aria-readonly",
      type: "string",
    },
    {
      name: "aria-relevant",
      type: "string",
    },
    {
      name: "aria-required",
      type: "string",
    },
    {
      name: "aria-roledescription",
      type: "string",
    },
    {
      name: "aria-rowcount",
      type: "number",
    },
    {
      name: "aria-rowindex",
      type: "number",
    },
    {
      name: "aria-rowindextext",
      type: "string",
    },
    {
      name: "aria-rowspan",
      type: "number",
    },
    {
      name: "aria-selected",
      type: "string",
    },
    {
      name: "aria-setsize",
      type: "number",
    },
    {
      name: "aria-sort",
      type: "string",
    },
    {
      name: "aria-valuemax",
      type: "number",
    },
    {
      name: "aria-valuemin",
      type: "number",
    },
    {
      name: "aria-valuenow",
      type: "number",
    },
    {
      name: "aria-valuetext",
      type: "string",
    },
    {
      name: "autoCapitalize",
      type: "string",
    },
    {
      name: "autoCorrect",
      type: "string",
    },
    {
      name: "autoFocus",
      type: "boolean",
    },
    {
      name: "autoSave",
      type: "string",
    },
    {
      name: "children",
      type: "string",
    },
    {
      name: "className",
      type: "string",
    },
    {
      name: "color",
      type: "string",
    },
    {
      name: "content",
      type: "string",
    },
    {
      name: "contentEditable",
      type: "string",
    },
    {
      name: "contextMenu",
      type: "string",
    },
    {
      name: "dangerouslySetInnerHTML",
      type: "string",
    },
    {
      name: "datatype",
      type: "string",
    },
    {
      name: "defaultChecked",
      type: "boolean",
    },
    {
      name: "defaultValue",
      type: "string",
    },
    {
      name: "dir",
      type: "string",
    },
    {
      name: "draggable",
      type: "string",
    },
    {
      name: "hidden",
      type: "boolean",
    },
    {
      name: "id",
      type: "string",
    },
    {
      name: "inlist",
      type: "string",
    },
    {
      name: "inputMode",
      type: "string",
    },
    {
      name: "is",
      type: "string",
    },
    {
      name: "itemID",
      type: "string",
    },
    {
      name: "itemProp",
      type: "string",
    },
    {
      name: "itemRef",
      type: "string",
    },
    {
      name: "itemScope",
      type: "boolean",
    },
    {
      name: "itemType",
      type: "string",
    },
    {
      name: "lang",
      type: "string",
    },
    {
      name: "nonce",
      type: "string",
    },
    {
      name: "onAbort",
      type: "string",
    },
    {
      name: "onAbortCapture",
      type: "string",
    },
    {
      name: "onAnimationEnd",
      type: "string",
    },
    {
      name: "onAnimationEndCapture",
      type: "string",
    },
    {
      name: "onAnimationIteration",
      type: "string",
    },
    {
      name: "onAnimationIterationCapture",
      type: "string",
    },
    {
      name: "onAnimationStart",
      type: "string",
    },
    {
      name: "onAnimationStartCapture",
      type: "string",
    },
    {
      name: "onAuxClick",
      type: "string",
    },
    {
      name: "onAuxClickCapture",
      type: "string",
    },
    {
      name: "onBeforeInput",
      type: "string",
    },
    {
      name: "onBeforeInputCapture",
      type: "string",
    },
    {
      name: "onBlur",
      type: "string",
    },
    {
      name: "onBlurCapture",
      type: "string",
    },
    {
      name: "onCanPlay",
      type: "string",
    },
    {
      name: "onCanPlayCapture",
      type: "string",
    },
    {
      name: "onCanPlayThrough",
      type: "string",
    },
    {
      name: "onCanPlayThroughCapture",
      type: "string",
    },
    {
      name: "onChange",
      type: "string",
    },
    {
      name: "onChangeCapture",
      type: "string",
    },
    {
      name: "onClick",
      type: "string",
    },
    {
      name: "onClickCapture",
      type: "string",
    },
    {
      name: "onCompositionEnd",
      type: "string",
    },
    {
      name: "onCompositionEndCapture",
      type: "string",
    },
    {
      name: "onCompositionStart",
      type: "string",
    },
    {
      name: "onCompositionStartCapture",
      type: "string",
    },
    {
      name: "onCompositionUpdate",
      type: "string",
    },
    {
      name: "onCompositionUpdateCapture",
      type: "string",
    },
    {
      name: "onContextMenu",
      type: "string",
    },
    {
      name: "onContextMenuCapture",
      type: "string",
    },
    {
      name: "onCopy",
      type: "string",
    },
    {
      name: "onCopyCapture",
      type: "string",
    },
    {
      name: "onCut",
      type: "string",
    },
    {
      name: "onCutCapture",
      type: "string",
    },
    {
      name: "onDoubleClick",
      type: "string",
    },
    {
      name: "onDoubleClickCapture",
      type: "string",
    },
    {
      name: "onDrag",
      type: "string",
    },
    {
      name: "onDragCapture",
      type: "string",
    },
    {
      name: "onDragEnd",
      type: "string",
    },
    {
      name: "onDragEndCapture",
      type: "string",
    },
    {
      name: "onDragEnter",
      type: "string",
    },
    {
      name: "onDragEnterCapture",
      type: "string",
    },
    {
      name: "onDragExit",
      type: "string",
    },
    {
      name: "onDragExitCapture",
      type: "string",
    },
    {
      name: "onDragLeave",
      type: "string",
    },
    {
      name: "onDragLeaveCapture",
      type: "string",
    },
    {
      name: "onDragOver",
      type: "string",
    },
    {
      name: "onDragOverCapture",
      type: "string",
    },
    {
      name: "onDragStart",
      type: "string",
    },
    {
      name: "onDragStartCapture",
      type: "string",
    },
    {
      name: "onDrop",
      type: "string",
    },
    {
      name: "onDropCapture",
      type: "string",
    },
    {
      name: "onDurationChange",
      type: "string",
    },
    {
      name: "onDurationChangeCapture",
      type: "string",
    },
    {
      name: "onEmptied",
      type: "string",
    },
    {
      name: "onEmptiedCapture",
      type: "string",
    },
    {
      name: "onEncrypted",
      type: "string",
    },
    {
      name: "onEncryptedCapture",
      type: "string",
    },
    {
      name: "onEnded",
      type: "string",
    },
    {
      name: "onEndedCapture",
      type: "string",
    },
    {
      name: "onError",
      type: "string",
    },
    {
      name: "onErrorCapture",
      type: "string",
    },
    {
      name: "onFocus",
      type: "string",
    },
    {
      name: "onFocusCapture",
      type: "string",
    },
    {
      name: "onGotPointerCapture",
      type: "string",
    },
    {
      name: "onGotPointerCaptureCapture",
      type: "string",
    },
    {
      name: "onInput",
      type: "string",
    },
    {
      name: "onInputCapture",
      type: "string",
    },
    {
      name: "onInvalid",
      type: "string",
    },
    {
      name: "onInvalidCapture",
      type: "string",
    },
    {
      name: "onKeyDown",
      type: "string",
    },
    {
      name: "onKeyDownCapture",
      type: "string",
    },
    {
      name: "onKeyPress",
      type: "string",
    },
    {
      name: "onKeyPressCapture",
      type: "string",
    },
    {
      name: "onKeyUp",
      type: "string",
    },
    {
      name: "onKeyUpCapture",
      type: "string",
    },
    {
      name: "onLoad",
      type: "string",
    },
    {
      name: "onLoadCapture",
      type: "string",
    },
    {
      name: "onLoadedData",
      type: "string",
    },
    {
      name: "onLoadedDataCapture",
      type: "string",
    },
    {
      name: "onLoadedMetadata",
      type: "string",
    },
    {
      name: "onLoadedMetadataCapture",
      type: "string",
    },
    {
      name: "onLoadStart",
      type: "string",
    },
    {
      name: "onLoadStartCapture",
      type: "string",
    },
    {
      name: "onLostPointerCapture",
      type: "string",
    },
    {
      name: "onLostPointerCaptureCapture",
      type: "string",
    },
    {
      name: "onMouseDown",
      type: "string",
    },
    {
      name: "onMouseDownCapture",
      type: "string",
    },
    {
      name: "onMouseEnter",
      type: "string",
    },
    {
      name: "onMouseLeave",
      type: "string",
    },
    {
      name: "onMouseMove",
      type: "string",
    },
    {
      name: "onMouseMoveCapture",
      type: "string",
    },
    {
      name: "onMouseOut",
      type: "string",
    },
    {
      name: "onMouseOutCapture",
      type: "string",
    },
    {
      name: "onMouseOver",
      type: "string",
    },
    {
      name: "onMouseOverCapture",
      type: "string",
    },
    {
      name: "onMouseUp",
      type: "string",
    },
    {
      name: "onMouseUpCapture",
      type: "string",
    },
    {
      name: "onPaste",
      type: "string",
    },
    {
      name: "onPasteCapture",
      type: "string",
    },
    {
      name: "onPause",
      type: "string",
    },
    {
      name: "onPauseCapture",
      type: "string",
    },
    {
      name: "onPlay",
      type: "string",
    },
    {
      name: "onPlayCapture",
      type: "string",
    },
    {
      name: "onPlaying",
      type: "string",
    },
    {
      name: "onPlayingCapture",
      type: "string",
    },
    {
      name: "onPointerCancel",
      type: "string",
    },
    {
      name: "onPointerCancelCapture",
      type: "string",
    },
    {
      name: "onPointerDown",
      type: "string",
    },
    {
      name: "onPointerDownCapture",
      type: "string",
    },
    {
      name: "onPointerEnter",
      type: "string",
    },
    {
      name: "onPointerEnterCapture",
      type: "string",
    },
    {
      name: "onPointerLeave",
      type: "string",
    },
    {
      name: "onPointerLeaveCapture",
      type: "string",
    },
    {
      name: "onPointerMove",
      type: "string",
    },
    {
      name: "onPointerMoveCapture",
      type: "string",
    },
    {
      name: "onPointerOut",
      type: "string",
    },
    {
      name: "onPointerOutCapture",
      type: "string",
    },
    {
      name: "onPointerOver",
      type: "string",
    },
    {
      name: "onPointerOverCapture",
      type: "string",
    },
    {
      name: "onPointerUp",
      type: "string",
    },
    {
      name: "onPointerUpCapture",
      type: "string",
    },
    {
      name: "onProgress",
      type: "string",
    },
    {
      name: "onProgressCapture",
      type: "string",
    },
    {
      name: "onRateChange",
      type: "string",
    },
    {
      name: "onRateChangeCapture",
      type: "string",
    },
    {
      name: "onReset",
      type: "string",
    },
    {
      name: "onResetCapture",
      type: "string",
    },
    {
      name: "onResize",
      type: "string",
    },
    {
      name: "onResizeCapture",
      type: "string",
    },
    {
      name: "onScroll",
      type: "string",
    },
    {
      name: "onScrollCapture",
      type: "string",
    },
    {
      name: "onSeeked",
      type: "string",
    },
    {
      name: "onSeekedCapture",
      type: "string",
    },
    {
      name: "onSeeking",
      type: "string",
    },
    {
      name: "onSeekingCapture",
      type: "string",
    },
    {
      name: "onSelect",
      type: "string",
    },
    {
      name: "onSelectCapture",
      type: "string",
    },
    {
      name: "onStalled",
      type: "string",
    },
    {
      name: "onStalledCapture",
      type: "string",
    },
    {
      name: "onSubmit",
      type: "string",
    },
    {
      name: "onSubmitCapture",
      type: "string",
    },
    {
      name: "onSuspend",
      type: "string",
    },
    {
      name: "onSuspendCapture",
      type: "string",
    },
    {
      name: "onTimeUpdate",
      type: "string",
    },
    {
      name: "onTimeUpdateCapture",
      type: "string",
    },
    {
      name: "onTouchCancel",
      type: "string",
    },
    {
      name: "onTouchCancelCapture",
      type: "string",
    },
    {
      name: "onTouchEnd",
      type: "string",
    },
    {
      name: "onTouchEndCapture",
      type: "string",
    },
    {
      name: "onTouchMove",
      type: "string",
    },
    {
      name: "onTouchMoveCapture",
      type: "string",
    },
    {
      name: "onTouchStart",
      type: "string",
    },
    {
      name: "onTouchStartCapture",
      type: "string",
    },
    {
      name: "onTransitionEnd",
      type: "string",
    },
    {
      name: "onTransitionEndCapture",
      type: "string",
    },
    {
      name: "onVolumeChange",
      type: "string",
    },
    {
      name: "onVolumeChangeCapture",
      type: "string",
    },
    {
      name: "onWaiting",
      type: "string",
    },
    {
      name: "onWaitingCapture",
      type: "string",
    },
    {
      name: "onWheel",
      type: "string",
    },
    {
      name: "onWheelCapture",
      type: "string",
    },
    {
      name: "placeholder",
      type: "string",
    },
    {
      name: "prefix",
      type: "string",
    },
    {
      name: "property",
      type: "string",
    },
    {
      name: "radioGroup",
      type: "string",
    },
    {
      name: "rel",
      type: "string",
    },
    {
      name: "resource",
      type: "string",
    },
    {
      name: "results",
      type: "number",
    },
    {
      name: "rev",
      type: "string",
    },
    {
      name: "role",
      type: "string",
    },
    {
      name: "security",
      type: "string",
    },
    {
      name: "slot",
      type: "string",
    },
    {
      name: "spellCheck",
      type: "string",
    },
    {
      name: "style",
      type: "string",
    },
    {
      name: "suppressContentEditableWarning",
      type: "boolean",
    },
    {
      name: "suppressHydrationWarning",
      type: "boolean",
    },
    {
      name: "tabIndex",
      type: "number",
    },
    {
      name: "title",
      type: "string",
    },
    {
      name: "translate",
      type: "string",
    },
    {
      name: "typeof",
      type: "string",
    },
    {
      name: "unselectable",
      type: "string",
    },
    {
      name: "vocab",
      type: "string",
    },
  ],
});
