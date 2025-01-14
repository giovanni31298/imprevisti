import { useRef } from "react";
import { supabase } from "../supabaseClient";
import { motion } from "framer-motion";
import { MdSend, MdClear } from "react-icons/md";
import { useForm } from "react-hook-form";
import useFetchData from "../Hooks/useFetchData";

const EditorImprevisti = () => {
  const {data, fetchRegistryList} = useFetchData("imprevisti")

  const aggiornaTitoloImprRef = useRef([]);
  const aggiornaDescImprRef = useRef([]);

  const removeVociRegistro = async (element) => {
    const { error } = await supabase
      .from("imprevisti")
      .delete()
      .eq("id", element);
    error && console.log(error);
    fetchRegistryList();
  };

  const updateVociRegistro = async (element, refTitolo, refDescr) => {
    const { error } = await supabase
      .from("imprevisti")
      .update({ titolo: refTitolo.toUpperCase(), descrizione: refDescr })
      .eq("id", element)
      .select();
    console.log(error && error);
    fetchRegistryList();
  };

  // LOGICA NUOVO IMPREVISTO

  const uploadNewImpr = async (objForm) => {
    const { titolo, descrizione } = objForm;
    const { error } = await supabase
      .from("imprevisti")
      .insert([
        {
          titolo: titolo.toUpperCase(),
          descrizione: descrizione,
        },
      ])
      .select();
    console.log(error && console.log(error));
    fetchRegistryList();
  };

  const handleNewImpr = (objForm) => {
    uploadNewImpr(objForm);
  };

  /* FORM INSERIMENTO IMPREVISTI */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data, e) => {
    handleNewImpr(data);
    //console.log(data);
    e.target.reset();
  };

  return (
    <section className="flex h-full w-full flex-col items-center gap-4 p-2 font-bold">
      <h1>Editor Imprevisti della Community</h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.7 }}
        className="flex h-full w-full items-center justify-around overflow-hidden rounded-lg bg-black/50 px-2 text-gray-300 md:flex-col"
      >
        {/* Lista Imprevisti Attuale */}

        <div className="relative flex min-h-[50dvh] w-full flex-col items-center justify-center gap-2 p-1">
          <header className="flex w-full items-center justify-between p-1">
            <strong className="w-full text-end text-sm font-semibold text-[--clr-ter]">
              Numero imprevisti: {data.length}
            </strong>
          </header>
          <ul className="flex h-full w-full flex-col gap-1 overflow-y-auto rounded-lg border p-4">
            {data?.map((el) => (
              <li
                key={el.id}
                className="flex select-all items-center justify-between gap-2 bg-gray-700/20 ps-2 text-left text-sm font-normal hover:bg-gray-600/50"
              >
                <input
                  className="w-1/6 rounded select-all border border-gray-300/20 bg-transparent p-1 pe-6 font-medium uppercase"
                  defaultValue={el.titolo}
                  ref={(element) =>
                    (aggiornaTitoloImprRef.current[el.id] = element)
                  }
                />
                <input
                  className="w-5/6 rounded border border-gray-300/20 bg-transparent p-1 pe-6 font-medium"
                  defaultValue={el.descrizione}
                  ref={(element) =>
                    (aggiornaDescImprRef.current[el.id] = element)
                  }
                />

                <MdSend
                  size={24}
                  className="cursor-pointer fill-gray-300 transition-all hover:scale-125 hover:fill-[--clr-ter]"
                  onClick={() =>
                    updateVociRegistro(
                      el.id,
                      aggiornaTitoloImprRef.current[el.id].value,
                      aggiornaDescImprRef.current[el.id].value,
                    )
                  }
                />
                <MdClear
                  size={24}
                  className="mx-2 cursor-pointer fill-red-600 transition-all hover:scale-125 hover:fill-[--clr-ter]"
                  onClick={() => removeVociRegistro(el.id)}
                />
              </li>
            ))}
          </ul>
        </div>
        {/* Form "AGGIUNGI Imprevisti" */}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex h-full w-3/4 flex-col items-center justify-between gap-2 rounded-md px-4 py-2 font-normal"
        >
          <h3 className="text-center uppercase text-[--clr-ter]">
            Aggiungi imprevisto
          </h3>
          <div className="flex h-full w-full items-start justify-around px-8">
            <label className="my-1 flex w-full flex-col items-start gap-4 self-start text-sm font-semibold">
              Titolo Imprevisto
              {errors.titolo && (
                <span className="text-[--clr-ter]">
                  Il campo Titolo è obbligatorio - max 20 caratteri
                </span>
              )}
              <input
                name="titolo"
                {...register("titolo", { required: true, maxLength: 20 })}
                className="block w-2/3 self-start rounded p-1 text-sm font-semibold uppercase text-black placeholder:normal-case placeholder:italic"
                placeholder="Titolo dell'imprevisto"
              />
            </label>
            <label className="my-1 flex flex-col w-full items-start gap-4 self-start text-sm font-semibold">
              Descrizione Imprevisto
              {errors.descrizione && (
                <span className="text-[--clr-ter]">
                  Il campo descrizione è obbligatorio
                </span>
              )}
              <textarea
                name="descrizione"
                {...register("descrizione", { required: true })}
                rows={6}
                id="descrizione"
                placeholder="Descrizione dell'imprevisto"
                className="w-full rounded p-1 text-sm font-semibold text-black placeholder:italic"
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-1/3 rounded-lg bg-sky-700 py-1 font-semibold hover:bg-sky-600"
          >
            Salva ed Invia
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default EditorImprevisti;
