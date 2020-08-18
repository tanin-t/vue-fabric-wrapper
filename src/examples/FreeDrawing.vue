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
        <b-col>
          <b-button @click="toggleDrawingMode()">{{
            isDrawingMode ? "Stop Drawing" : "Start Drawing"
          }}</b-button>
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
      freeDrawingBrush: {
        width: 1,
        color: "#000000"
      },
      objs: [],
      list: [],
      selection: []
    };
  },
  methods: {
    toggleDrawingMode() {
      const canvas = this.$refs.canvas.canvas;
      this.isDrawingMode = !this.isDrawingMode;

      if (!this.isDrawingMode) {
        const positions = [];
        for (const obj of this.list) {
          obj.id = this.genID();
          positions.push({ top: obj.top, left: obj.left });
        }

        const group = new fabric.Group(this.list);
        for (let i = 0; i < positions.length; i++) {
          group.item(i).set({ top: positions[i].top, left: positions[i].left });
        }
        group.id = this.genID();
        this.objs.push(group);

        for (const obj of this.list) {
          canvas.remove(obj);
        }

        this.list = [];
        console.log(this.objs, this.list);
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
        this.list.push(e.target);
      }
    },
    // onSelectionCreated(e) {
    //   console.log("onSelectionCreated", e);
    //   this.selection = e.target;
    // },
    // onSelectionUpdated(e) {
    //   console.log("onSelectionUpdated", e);
    //   this.selection = e.target;
    // },
    isEqual(obj1, obj2) {
      const props = [""];
      return false;
    }
  }
};
</script>
