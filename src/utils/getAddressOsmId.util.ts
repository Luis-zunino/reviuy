export interface GetAddressOsmIdProps {
  osm_type?: string;
  osm_id?: string;
}

/**
 * This function return addressOsmId value
 * @param props
 * @returns
 */
export const getAddressOsmId = (props: GetAddressOsmIdProps) => {
  const { osm_type, osm_id } = props;
  return osm_type?.charAt(0).toUpperCase() + String(osm_id);
};
