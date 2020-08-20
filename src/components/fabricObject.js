const OBJECT_EVENTS = [
  "added",
  "removed",
  "selected",
  "deselected",
  "modified",
  "moved",
  "scaled",
  "rotated",
  "skewed",
  "rotating",
  "scaling",
  "moving",
  "skewing",
  "mousedown",
  "mouseup",
  "mouseover",
  "mouseout",
  "mousewheel",
  "mousedblclick",
  "dragover",
  "dragenter",
  "dragleave",
  "drop"
];

//Props to change via interaction and need to be emitted for prop.sync usage
const EMIT_PROPS = [
  "angle",
  "height",
  "left",
  "originX",
  "originY",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY",
  "top",
  "width"
];

//Props that require a render once changed
const REQUIRE_RENDER = [
  "angle",
  "height",
  "left",
  "originX",
  "originY",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY",
  "top",
  "width",
  "visible",
  "fill",
  "stroke",
  "strokeWidth"
];

//Monitor the fabric Object (item) and emit an update to allow .sync usage
const watchEmitProp = (key, deep) => ({
  handler(newValue) {
    //If the prop caused the update there is no point emitting it back
    if (this.$props[key] === newValue) {
      return;
    }
    this.$emit("update:" + key, newValue);
  },
  deep
});
//Monitor the Props and update the item with the changed value
const watchProp = (key, deep) => ({
  handler(newValue) {
    //If the prop did not cause the update there is no updating the canvas
    if (typeof this.item == "undefined") {
      return;
    }
    if (key === "id") {
      this.item.id = newValue;
      return;
    }
    if (this.item.get(key) === newValue) {
      return;
    }
    this.item.set(key, newValue);
    if (REQUIRE_RENDER.includes(key)) {
      this.canvas.renderAll();
    }
  },
  deep
});

export default {
  name: "fabric-object",
  inheritAttrs: false,
  props: {
    id: { type: [Number, String], required: true },
    angle: Number,
    backgroundColor: String,
    borderColor: String,
    borderDashArray: Array,
    borderOpacityWhenMoving: Number,
    borderScaleFactor: Number,
    cacheProperties: Array,
    centeredRotation: { type: Boolean, default: true },
    centeredScaling: { type: Boolean, default: false },
    //clipPath :fabric.Object,
    cornerColor: String,
    cornerDashArray: Array,
    cornerSize: Number,
    cornerStrokeColor: String,
    cornerStyle: String,
    dirty: { type: Boolean, default: true },
    evented: { type: Boolean, default: true },
    excludeFromExport: { type: Boolean, default: false },
    fill: String,
    fillRule: String,
    flipX: Boolean,
    flipY: Boolean,
    globalCompositeOperation: String,
    hasBorders: { type: Boolean, default: true },
    hasControls: { type: Boolean, default: true },
    hasRotatingPoint: { type: Boolean, default: true },
    height: Number,
    hoverCursor: String,
    includeDefaultValues: { type: Boolean, default: true },
    inverted: { type: Boolean, default: false },
    left: Number,
    lockMovementX: { type: Boolean, default: false },
    lockMovementY: { type: Boolean, default: false },
    lockRotation: { type: Boolean, default: false },
    lockScalingFlip: { type: Boolean, default: false },
    lockScalingX: { type: Boolean, default: false },
    lockScalingY: { type: Boolean, default: false },
    lockSkewingX: { type: Boolean, default: false },
    lockSkewingY: { type: Boolean, default: false },
    lockUniScaling: { type: Boolean, default: false },
    minScaleLimit: Number,
    moveCursor: String,
    noScaleCache: { type: Boolean, default: true },
    objectCaching: { type: Boolean, default: true },
    opacity: Number,
    originX: String,
    originY: String,
    padding: Number,
    paintFirst: String,
    perPixelTargetFind: { type: Boolean, default: false },
    rotatingPointOffset: Number,
    scaleX: Number,
    scaleY: Number,
    selectable: { type: Boolean, default: true },
    selectionBackgroundColor: String,
    //shadow :fabric.Shadow,
    skewX: Number,
    skewY: Number,
    //statefullCache: Boolean,
    stateProperties: Array,
    stroke: String,
    strokeDashArray: Array,
    strokeDashOffset: Number,
    strokeLineCap: String,
    strokeLineJoin: String,
    strokeMiterLimit: Number,
    strokeUniform: { type: Boolean, default: false },
    strokeWidth: Number,
    top: Number,
    //transformMatrix :Array, Depreciated,
    transparentCorners: { type: Boolean, default: true },
    //type :String, not editable
    visible: { type: Boolean, default: true },
    width: Number
  },
  inject: ["$canvas", "$group", "fabric"],
  provide() {
    return {
      $item: () => this.item
    };
  },
  computed: {
    canvas() {
      return this.$canvas();
    },
    group() {
      return this.$group();
    },
    definedProps() {
      const obj = { ...this.$props };
      Object.keys(obj).forEach(key => {
        if (obj[key] === undefined) {
          delete obj[key];
        }
      });
      return obj;
    },
    parentType() {
      if (this.group) {
        return "group";
      }
      return "canvas";
    },
    parentItem() {
      if (this.parentType == "canvas") {
        return this.canvas;
      }
      if (this.parentType == "group") {
        return this.group;
      }
    },
    item() {
      if (this.parentItem) {
        let canvasObj = this.canvas.getObjects();
        let res = [];
        this.transverseCanvasObjects(canvasObj, "id", this.id, res);
        return res[0];
      }
    }
  },
  methods: {
    transverseCanvasObjects(objects, attr, val, objectList) {
      for (let i in objects) {
        //look inside groups unless it is a group object you are searching for
        if (objects[i]["type"] == "group" && objects[i][attr] !== val) {
          this.transverseCanvasObjects(
            objects[i].getObjects(),
            attr,
            val,
            objectList
          );
        } else if (objects[i][attr] == val) {
          objectList.push(objects[i]);
        }
      }
    },
    createEvents() {
      OBJECT_EVENTS.forEach(event => {
        this.item.on(event, e => {
          this.$emit(event, { id: this.id, ...e });
        });
      });
    },
    destroyEvents() {
      OBJECT_EVENTS.forEach(event => {
        if (this.item) {
          this.item.off(event);
        }
      });
    },
    createWatchers() {
      this.createFabricItemWatchers();
      this.createPropWatchers();
    },
    createFabricItemWatchers() {
      //Setup Watchers for emmit sync option
      EMIT_PROPS.forEach(prop => {
        this.$watch("item." + prop, watchEmitProp(prop, true));
      });
    },
    createPropWatchers() {
      //Setup prop watches to sync with fabric
      Object.keys(this.$props).forEach(key => {
        //Custom watch check to make sure the mixin also does not genearte a watch
        if (typeof this.customWatch !== typeof undefined) {
          if (this.customWatch.includes(key)) {
            return;
          }
        }
        this.$watch(key, watchProp(key, true));
      });
    }
  },
  beforeDestroy() {
    this.destroyEvents();
    if (this.parentType == "group") {
      if (this.group) {
        this.group.removeWithUpdate(this.item);
      }
    } else {
      if (this.canvas) {
        this.canvas.remove(this.item);
      }
    }
  }
};
