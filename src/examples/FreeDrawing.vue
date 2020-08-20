<template>
  <div id="app">
    <b-container>
      <h1>Freehand</h1>
      <b-row>
        <b-col>
          <fabric-canvas
            ref="canvas"
            :id="'freehand-test'"
            :is-drawing-mode="isDrawingMode"
            :free-drawing-brush="freeDrawingBrush"
            :width="700"
            :height="400"
            @object-added="onObjectAdded($event)"
          >
            <template v-for="obj in objs">
              <fabric-path
                v-if="obj.type === 'path'"
                :id="obj.id"
                :key="obj.id"
                v-bind="obj"
              ></fabric-path>

              <fabric-group
                v-if="obj.type === 'group'"
                :id="obj.id"
                :key="obj.id"
                v-bind="obj"
              >
                <fabric-path
                  v-for="obj in obj._objects"
                  :id="obj.id"
                  :key="obj.id"
                  v-bind="obj"
                ></fabric-path>
              </fabric-group>
            </template>
          </fabric-canvas>
        </b-col>
        <b-col style="text-align: left;">
          <b-button @click="toggleDrawingMode()">
            {{ isDrawingMode ? "Stop Drawing" : "Start Drawing" }}
          </b-button>
          <b-button @click="clearCanvas()">
            Clear
          </b-button>
          <br />
          <br />

          <label>Brush Size: {{ freeDrawingBrush.width }}</label>
          <b-form-input
            type="range"
            v-model="freeDrawingBrush.width"
          ></b-form-input>

          <label>Color: {{ freeDrawingBrush.color }}</label>
          <b-form-input
            type="color"
            v-model="freeDrawingBrush.color"
          ></b-form-input>

          <br />
          <b-form-checkbox v-model="isAutoGroupDrawing">
            Auto group when stop drawing
          </b-form-checkbox>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import FabricGroup from "../components/FabricGroup";
import FabricPath from "../components/FabricPath";
import * as fabric from "fabric";

export default {
  components: {
    FabricPath,
    FabricGroup
  },
  data() {
    return {
      isDrawingMode: true,
      isAutoGroupDrawing: false,
      freeDrawingBrush: {
        width: 1,
        color: "#000000"
      },
      objs: [],
      drawingPaths: []
    };
  },
  computed: {
    json_objs() {
      return JSON.stringify(this.objs);
    }
  },
  methods: {
    toggleDrawingMode() {
      const canvas = this.$refs.canvas.canvas;
      this.isDrawingMode = !this.isDrawingMode;

      if (!this.isDrawingMode) {
        if (this.isAutoGroupDrawing) {
          this.makeGroup(this.drawingPaths);
        } else {
          for (const path of this.drawingPaths) {
            path.id = this.genID();
            this.objs.push(path);
            canvas.remove(path);
          }
        }

        this.drawingPaths = [];
      }
    },
    genID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    onObjectAdded(e) {
      if (this.isDrawingMode) {
        this.drawingPaths.push(e.target);
      }
    },
    clearCanvas () {
      this.objs = []
    },
    makeGroup(paths) {
      // fabric.Group() move center of drawing path to 0,0
      // So I store the position of each path in an array
      // before creating group.
      const positions = [];
      for (const path of paths) {
        path.id = this.genID();
        positions.push({ top: path.top, left: path.left });
      }

      // Create group
      const group = new fabric.Group(paths);

      // After creating group re-assign the position of each path
      for (let i = 0; i < positions.length; i++) {
        group.item(i).set({ top: positions[i].top, left: positions[i].left });
      }

      // add group object to main objs array
      group.id = this.genID();
      this.objs.push(group);

      // remove the duplicate paths
      const canvas = this.$refs.canvas.canvas
      for (const path of paths) {
        canvas.remove(path);
      }
      canvas.requestRenderAll();
    }
  }
};
</script>
