<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { loadOml2d } from "oh-my-live2d";
import { resolvePublicAssetUrl } from "../utils/assets";

const MODEL_CATALOG = {
  tororo: {
    label: "Tororo",
    path: resolvePublicAssetUrl("live2d/tororo/runtime/tororo.model3.json"),
    scale: 0.18,
    position: [310, 690],
    mobileScale: 0.15,
    mobilePosition: [180, 460]
  },
  hijiki: {
    label: "Hijiki",
    path: resolvePublicAssetUrl("live2d/hijiki/runtime/hijiki.model3.json"),
    scale: 0.18,
    position: [310, 690],
    mobileScale: 0.15,
    mobilePosition: [180, 460]
  }
};

const hostRef = ref(null);
const activeModel = ref("tororo");
const loadError = ref("");

let live2dInstance = null;

function resetStoredStageState() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem("OML2D_STATUS");
  window.localStorage.removeItem("OML2D_MODEL_INDEX");
  window.localStorage.removeItem("OML2D_MODEL_CLOTHES_INDEX");
}

function teardownLive2d() {
  const instance = live2dInstance;
  live2dInstance = null;

  if (!instance) {
    hostRef.value?.replaceChildren();
    return;
  }

  try {
    instance.stopTipsIdle?.();
  } catch {}

  try {
    instance.pixiApp?.unMount?.();
    instance.pixiApp?.app?.destroy?.(true, {
      children: true,
      texture: true,
      baseTexture: true
    });
  } catch {}

  try {
    instance.models?.model?.destroy?.({
      children: true,
      texture: true,
      baseTexture: true
    });
  } catch {}

  try {
    instance.menus?.unmount?.();
    instance.tips?.unmount?.();
    instance.statusBar?.unMount?.();
    instance.stage?.unMount?.();
  } catch {}

  hostRef.value?.replaceChildren();
}

function createModelOptions(name) {
  const model = MODEL_CATALOG[name] ?? MODEL_CATALOG.tororo;

  return {
    sayHello: false,
    mobileDisplay: true,
    initialStatus: "active",
    transitionTime: 1,
    parentElement: hostRef.value,
    stageStyle: {
      width: "100%",
      height: "100%",
      position: "absolute",
      left: 0,
      top: 0,
      right: "auto",
      bottom: "auto",
      transform: "none",
      zIndex: "1",
      overflow: "visible"
    },
    statusBar: {
      disable: true
    },
    menus: {
      disable: true
    },
    tips: {
      style: {
        display: "none"
      },
      mobileStyle: {
        display: "none"
      },
      idleTips: {
        message: []
      },
      welcomeTips: {
        message: {}
      },
      copyTips: {
        message: []
      }
    },
    models: [
      {
        name,
        path: model.path,
        scale: model.scale,
        position: model.position,
        mobileScale: model.mobileScale,
        mobilePosition: model.mobilePosition,
        anchor: [0.5, 1],
        stageStyle: {
          width: "100%",
          height: "100%"
        },
        mobileStageStyle: {
          width: "100%",
          height: "100%"
        }
      }
    ]
  };
}

function mountLive2d(name = activeModel.value) {
  if (!hostRef.value) {
    return;
  }

  loadError.value = "";
  teardownLive2d();
  resetStoredStageState();

  try {
    live2dInstance = loadOml2d(createModelOptions(name));
    live2dInstance.onLoad?.((status) => {
      if (status === "fail") {
        loadError.value = "Live2D 模型加载失败";
      }
    });
  } catch (error) {
    loadError.value = "Live2D 模型初始化失败";
    console.error(error);
  }
}

function switchModel(name) {
  if (name === activeModel.value) {
    return;
  }

  activeModel.value = name;
  mountLive2d(name);
}

onMounted(() => {
  mountLive2d();
});

onBeforeUnmount(() => {
  teardownLive2d();
});
</script>

<template>
  <div class="live2d-stage">
    <div ref="hostRef" class="live2d-stage__host" aria-label="首页 Live2D 模型展示" />

    <div class="live2d-stage__switcher">
      <button
        v-for="(model, key) in MODEL_CATALOG"
        :key="key"
        type="button"
        :class="{ 'is-active': activeModel === key }"
        @click="switchModel(key)"
      >
        {{ model.label }}
      </button>
    </div>

    <p v-if="loadError" class="live2d-stage__error">{{ loadError }}</p>
  </div>
</template>

<style scoped>
.live2d-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.live2d-stage::before {
  content: "";
  position: absolute;
  inset: 9% 18% 12%;
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 0.88), transparent 48%),
    radial-gradient(circle at 52% 68%, rgba(228, 214, 192, 0.3), transparent 56%);
  filter: blur(16px);
  pointer-events: none;
}

.live2d-stage::after {
  content: "";
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 6%;
  height: 12%;
  border-radius: 999px;
  background: radial-gradient(circle at 50% 50%, rgba(68, 57, 48, 0.22), transparent 70%);
  filter: blur(12px);
  pointer-events: none;
}

.live2d-stage__host {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.live2d-stage__switcher {
  position: absolute;
  right: 4%;
  bottom: 6%;
  z-index: 3;
  display: flex;
  gap: 0.45rem;
}

.live2d-stage__switcher button {
  border: 1px solid rgba(27, 28, 24, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.76);
  color: #20231c;
  padding: 0.36rem 0.72rem;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;
}

.live2d-stage__switcher button:hover,
.live2d-stage__switcher button.is-active {
  background: rgba(17, 18, 13, 0.92);
  color: #fffaf0;
  border-color: rgba(17, 18, 13, 0.92);
  transform: translateY(-1px);
}

.live2d-stage__error {
  position: absolute;
  left: 50%;
  bottom: 8%;
  transform: translateX(-50%);
  z-index: 4;
  margin: 0;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: rgba(145, 52, 36, 0.86);
  color: #fff;
  font-size: 0.72rem;
  letter-spacing: 0.03em;
}

@media (max-width: 900px) {
  .live2d-stage__switcher {
    right: 50%;
    bottom: 3%;
    transform: translateX(50%);
  }

  .live2d-stage__switcher button {
    padding: 0.34rem 0.66rem;
    font-size: 0.68rem;
  }
}
</style>
