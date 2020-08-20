<template>
  <div>
    <b-row>
      <b-col>
        <div style="position: relative;">
          <fabric-canvas :width="600" :height="400">
            <template v-for="fabricObject in fabricObjects">
              <fabric-circle
                v-if="fabricObject.type === 'circle'"
                :id="fabricObject.id"
                :key="fabricObject.id"
                v-bind="fabricObject.props"
                @mousedblclick="openSettingDialog($event, fabricObject)"
                @modified="onObjectModified($event, fabricObject)"
              ></fabric-circle>
              <fabric-rectangle
                v-if="fabricObject.type === 'rectangle'"
                :id="fabricObject.id"
                :key="fabricObject.id"
                v-bind="fabricObject.props"
                @mousedblclick="openSettingDialog($event, fabricObject)"
                @modified="onObjectModified($event, fabricObject)"
              ></fabric-rectangle>
              <fabric-triangle
                v-if="fabricObject.type === 'triangle'"
                :id="fabricObject.id"
                :key="fabricObject.id"
                v-bind="fabricObject.props"
                @mousedblclick="openSettingDialog($event, fabricObject)"
                @modified="onObjectModified($event, fabricObject)"
              ></fabric-triangle>
              <fabric-line
                v-if="fabricObject.type === 'line'"
                :id="fabricObject.id"
                :key="fabricObject.id"
                v-bind="fabricObject.props"
                @mousedblclick="openSettingDialog($event, fabricObject)"
                @modified="onObjectModified($event, fabricObject)"
              ></fabric-line>
            </template>
            <div>Double click at the shape to open control dialog</div>
            <hr />

            <div
              v-for="fabricObject in fabricObjects"
              :key="'detail' + fabricObject.id"
            >
              <code>{{ fabricObject }}</code>
              <hr class="mx-5" />
            </div>
          </fabric-canvas>

          <div
            class="menu"
            v-show="menu.show"
            :style="`top: ${menu.top}px; left: ${menu.left}px`"
          >
            <b-row class="pt-2 mx-0">
              <b-col>Control</b-col>
              <b-col class="text-right mx-0 pr-3">
                <b-button
                  class="mr-0"
                  size="sm"
                  variant="light"
                  @click="menu.show = false"
                >
                  close
                </b-button>
              </b-col>
            </b-row>

            <hr class="my-1" />
            <div class="px-2" v-if="selectedObject">
              <b-form-group label="Fill Color">
                <b-form-input
                  type="color"
                  :value="selectedObject.props.fill"
                  @input="selectedObject.props.fill = $event"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Stroke Color">
                <b-form-input
                  type="color"
                  :value="selectedObject.props.stroke"
                  @input="selectedObject.props.stroke = $event"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Stroke Width">
                <b-form-input
                  type="range"
                  :value="selectedObject.props.strokeWidth"
                  @input="
                    selectedObject.props.strokeWidth = parseInt($event, 10)
                  "
                ></b-form-input>
              </b-form-group>
              <b-button
                size="sm"
                variant="danger"
                @click="removeObject(selectedObject)"
              >
                Delete
              </b-button>
            </div>
          </div>
        </div>
      </b-col>
      <b-col>
        <div>
          <b-button
            variant="outline-primary"
            class="mx-1"
            @click="addObjectToCanvas('circle')"
          >
            Circle
          </b-button>
          <b-button
            variant="outline-primary"
            class="mx-1"
            @click="addObjectToCanvas('rectangle')"
            >Rectangle</b-button
          >
          <b-button
            variant="outline-primary"
            class="mx-1"
            @click="addObjectToCanvas('triangle')"
            >Triangle</b-button
          >
          <b-button
            variant="outline-primary"
            class="mx-1"
            @click="addLineObjectToCanvas()"
            >Line</b-button
          >
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import FabricCanvas from "../components/FabricCanvas";
import FabricCircle from "../components/FabricCircle";
import FabricRectangle from "../components/FabricRectangle";
import FabricTriangle from "../components/FabricTriangle";
import FabricLine from "../components/FabricLine";
import uuid from "../assets/js/uuid";

const FABRIC_OBJECT_PROPS = {
  fill: "#000000",
  stroke: "#000000",
  strokeWidth: 0,
  top: 0,
  left: 0,
  originX: "left",
  originY: "top",
  angle: 0,
  scaleX: 1,
  scalyY: 1
};

export default {
  components: {
    FabricCanvas,
    FabricCircle,
    FabricRectangle,
    FabricTriangle,
    FabricLine
  },

  data() {
    return {
      menu: {
        show: false,
        top: 0,
        left: 0
      },
      fabricObjects: [],
      selectedObject: null
    };
  },

  mounted() {
    this.addObjectToCanvas("circle");
  },

  methods: {
    addObjectToCanvas(type) {
      this.fabricObjects.push({
        id: uuid(),
        type: type,
        props: { ...FABRIC_OBJECT_PROPS }
      });
    },

    addLineObjectToCanvas() {
      this.fabricObjects.push({
        id: uuid(),
        type: "line",
        props: {
          ...FABRIC_OBJECT_PROPS,
          x1: 0,
          y1: 0,
          x2: 100,
          y2: 100,
          strokeWidth: 1
        }
      });
    },

    removeObject(fabricObject) {
      this.fabricObjects = this.fabricObjects.filter(
        x => x.id !== fabricObject.id
      );
      this.menu.show = false;
    },

    onObjectModified(e, fabricObject) {
      for (const key in FABRIC_OBJECT_PROPS) {
        fabricObject.props[key] = e.target[key];
      }
    },

    openSettingDialog(e, fabricObject) {
      console.log("@mousedblclick", e);

      this.selectedObject = fabricObject;
      this.menu.top = e.pointer.y;
      this.menu.left = e.pointer.x;
      this.menu.show = true;
    }
  }
};
</script>

<style scoped>
.menu {
  position: absolute;
  width: 285px;
  height: 350px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #eeeeee;
  border-radius: 10px;
  box-shadow: 3px 4px 4px #888888;
  z-index: 100;
}
</style>
