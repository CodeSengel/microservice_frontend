import { useQuasar } from "quasar";

export default function useNotify() {
  const $q = useQuasar();

  const notifySuccess = async (message) => {
    $q.notify({
      type: "positive",
      message: message,
      position:'top'
    });
  };

  const notifyError = async (message) => {
    $q.notify({
      type: "negative",
      message: message || "!",
      position:'top'
    });
  };

  return {
    notifySuccess,
    notifyError,
  };
}
